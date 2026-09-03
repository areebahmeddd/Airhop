//! Bridge and pluggable transport configuration.
//!
//! A bridge is an unlisted entry relay; a transport disguises the connection to
//! it. Together they let Tor work on a network that blocks it, and stop that
//! network seeing Tor is in use.
//!
//! The transports run elsewhere. Arti would normally spawn them as child
//! processes, which iOS forbids, so each platform runs them in-process (see
//! `native/iptproxy`) and passes the loopback ports they landed on. Arti dials
//! those as an unmanaged transport.
//!
//! Parsing belongs here rather than in TypeScript because Arti owns the
//! grammar, and a second parser above the FFI could only disagree with it.

use std::net::SocketAddr;
use std::str::FromStr;

use arti_client::config::pt::TransportConfigBuilder;
use arti_client::config::{BoolOrAuto, BridgeConfigBuilder, TorClientConfigBuilder};

use crate::{AIRHOP_TOR_ERR_BRIDGE_LINE, AIRHOP_TOR_ERR_BRIDGE_TRANSPORT};

/// Where each in-process transport is listening, or 0 when it is not running.
#[derive(Clone, Copy, Debug, Default)]
pub struct TransportPorts {
    pub obfs4: u16,
    pub snowflake: u16,
}

/// Transport names Airhop ships. A line naming anything else is refused rather
/// than passed through, because nothing would be listening for it.
const OBFS4: &str = "obfs4";
const SNOWFLAKE: &str = "snowflake";

/// Arti packs a transport's settings into the SOCKS5 username and password, 255
/// bytes each. A longer line parses and configures cleanly, then fails per
/// connection with an error about SOCKS rather than about what the user pasted.
/// Published Snowflake lines sit close enough to this to matter.
const MAX_PT_SETTINGS_BYTES: usize = 255 * 2;

/// Apply `lines` to `builder`, returning whether any bridge was configured.
///
/// An empty or whitespace-only `lines` leaves the builder untouched, which is a
/// direct connection to a public relay.
pub fn apply(
    builder: &mut TorClientConfigBuilder,
    lines: &str,
    ports: TransportPorts,
) -> Result<bool, i32> {
    let parsed: Vec<BridgeConfigBuilder> = lines
        .lines()
        .map(str::trim)
        .filter(|line| !line.is_empty() && !line.starts_with('#'))
        .map(|line| BridgeConfigBuilder::from_str(line).map_err(|_| AIRHOP_TOR_ERR_BRIDGE_LINE))
        .collect::<Result<_, _>>()?;

    if parsed.is_empty() {
        return Ok(false);
    }

    // Only the transports the lines name. Configuring one nothing references
    // would hide a typo in a transport name behind a working build.
    let mut needs_obfs4 = false;
    let mut needs_snowflake = false;

    for bridge in &parsed {
        match bridge.get_transport() {
            Some(OBFS4) => needs_obfs4 = true,
            Some(SNOWFLAKE) => needs_snowflake = true,
            // An unlisted relay with no transport. Arti spells that as the
            // empty name; a missing one means the same.
            None | Some("") => {}
            Some(_) => return Err(AIRHOP_TOR_ERR_BRIDGE_TRANSPORT),
        }
        check_settings_len(bridge)?;
    }

    for bridge in parsed {
        builder.bridges().bridges().push(bridge);
    }

    if needs_obfs4 {
        push_transport(builder, OBFS4, ports.obfs4)?;
    }
    if needs_snowflake {
        push_transport(builder, SNOWFLAKE, ports.snowflake)?;
    }

    // Explicit rather than `Auto`, which infers from whether the list is empty.
    // This way an empty list is an error instead of a silent direct connection.
    builder.bridges().enabled(BoolOrAuto::Explicit(true));

    Ok(true)
}

/// Point Arti at the loopback proxy for one transport.
fn push_transport(builder: &mut TorClientConfigBuilder, name: &str, port: u16) -> Result<(), i32> {
    // Port 0 means the app did not get this transport running. Refusing is what
    // makes the failure closed: starting anyway would take a direct route for a
    // user who asked not to have one.
    if port == 0 {
        return Err(AIRHOP_TOR_ERR_BRIDGE_TRANSPORT);
    }

    let mut transport = TransportConfigBuilder::default();
    transport
        .protocols(vec![name
            .parse()
            .map_err(|_| AIRHOP_TOR_ERR_BRIDGE_TRANSPORT)?])
        .proxy_addr(SocketAddr::from(([127, 0, 0, 1], port)));
    builder.bridges().transports().push(transport);
    Ok(())
}

/// Reject a line whose transport settings cannot fit in a SOCKS5 handshake.
///
/// Mirrors `tor_chanmgr`'s encoding: `k=v` pairs joined by `;`, with `\` and `;`
/// escaped in both halves and `=` only in the key. Escaping `=` in values too
/// would overcount every Snowflake URL and reject lines that do fit.
fn check_settings_len(bridge: &BridgeConfigBuilder) -> Result<(), i32> {
    let Some(settings) = bridge.opt_settings() else {
        return Ok(());
    };

    // Bytes, not chars: an escape adds one ASCII backslash.
    let escaped =
        |s: &str, escapes: &str| s.len() + s.chars().filter(|c| escapes.contains(*c)).count();
    // key, '=', value, and the ';' joining it to the next pair.
    let total: usize = settings
        .iter()
        .map(|(key, value)| escaped(key, "\\;=") + 1 + escaped(value, "\\;") + 1)
        .sum::<usize>()
        .saturating_sub(1);

    if total > MAX_PT_SETTINGS_BYTES {
        return Err(AIRHOP_TOR_ERR_BRIDGE_TRANSPORT);
    }
    Ok(())
}

#[cfg(test)]
mod test {
    use super::*;

    // Documentation addresses (RFC 5737) and a placeholder relay identity. The
    // value does not matter to parsing; only its shape does.
    const FINGERPRINT: &str = "0123456789ABCDEF0123456789ABCDEF01234567";
    const OBFS4_LINE: &str = "obfs4 192.0.2.1:443 0123456789ABCDEF0123456789ABCDEF01234567 \
        cert=abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ012345 iat-mode=0";
    const SNOWFLAKE_LINE: &str = "snowflake 192.0.2.3:80 0123456789ABCDEF0123456789ABCDEF01234567 \
        url=https://example.invalid/ fronts=a.example,b.example";
    const DIRECT_LINE: &str = "192.0.2.9:9001 0123456789ABCDEF0123456789ABCDEF01234567";

    fn builder() -> TorClientConfigBuilder {
        TorClientConfigBuilder::from_directories("/nonexistent/state", "/nonexistent/cache")
    }

    fn ports() -> TransportPorts {
        TransportPorts {
            obfs4: 47100,
            snowflake: 47200,
        }
    }

    #[test]
    fn empty_input_configures_nothing() {
        let mut b = builder();
        assert_eq!(apply(&mut b, "", ports()), Ok(false));
        assert_eq!(apply(&mut b, "   \n\n  ", ports()), Ok(false));
    }

    #[test]
    fn comments_and_blank_lines_are_skipped() {
        let mut b = builder();
        let input = format!("# a comment\n\n{OBFS4_LINE}\n");
        assert_eq!(apply(&mut b, &input, ports()), Ok(true));
    }

    #[test]
    fn obfs4_and_snowflake_configure() {
        let mut b = builder();
        let input = format!("{OBFS4_LINE}\n{SNOWFLAKE_LINE}");
        assert_eq!(apply(&mut b, &input, ports()), Ok(true));
        assert!(b.build().is_ok());
    }

    #[test]
    fn a_direct_bridge_needs_no_transport() {
        let mut b = builder();
        assert_eq!(
            apply(&mut b, DIRECT_LINE, TransportPorts::default()),
            Ok(true)
        );
    }

    #[test]
    fn a_malformed_line_is_rejected() {
        let mut b = builder();
        assert_eq!(
            apply(&mut b, "this is not a bridge line", ports()),
            Err(AIRHOP_TOR_ERR_BRIDGE_LINE)
        );
    }

    /// The fail-closed case: a transport was asked for but is not running.
    #[test]
    fn a_transport_with_no_port_is_refused() {
        let mut b = builder();
        assert_eq!(
            apply(&mut b, OBFS4_LINE, TransportPorts::default()),
            Err(AIRHOP_TOR_ERR_BRIDGE_TRANSPORT)
        );
    }

    #[test]
    fn a_transport_airhop_does_not_ship_is_refused() {
        let mut b = builder();
        let line = OBFS4_LINE.replacen("obfs4", "meek_lite", 1);
        assert_eq!(
            apply(&mut b, &line, ports()),
            Err(AIRHOP_TOR_ERR_BRIDGE_TRANSPORT)
        );
    }

    #[test]
    fn settings_too_long_for_socks_are_refused() {
        let mut b = builder();
        let line = format!("{SNOWFLAKE_LINE} ice={}", "s".repeat(MAX_PT_SETTINGS_BYTES));
        assert_eq!(
            apply(&mut b, &line, ports()),
            Err(AIRHOP_TOR_ERR_BRIDGE_TRANSPORT)
        );
    }

    /// `=` inside a value is not escaped, so a query string must not be counted
    /// as if it were. Snowflake URLs carry them.
    #[test]
    fn equals_signs_in_a_value_are_not_counted_as_escaped() {
        let value = format!("https://example.invalid/?{}", "a=b&".repeat(60));
        let line = format!("snowflake 192.0.2.3:80 {FINGERPRINT} url={value}");
        let mut b = builder();
        assert_eq!(apply(&mut b, &line, ports()), Ok(true));
    }

    #[test]
    fn a_published_snowflake_line_fits() {
        // The shape bridges.torproject.org hands out, which is the closest real
        // input to the SOCKS limit.
        let line = "snowflake 192.0.2.3:80 0123456789ABCDEF0123456789ABCDEF01234567 \
            fingerprint=0123456789ABCDEF0123456789ABCDEF01234567 \
            url=https://1098762253.rsc.cdn77.org/ \
            fronts=www.cdn77.com,www.phpmyadmin.net \
            ice=stun:stun.l.google.com:19302,stun:stun.antisip.com:3478,\
stun:stun.bluesip.net:3478,stun:stun.dus.net:3478,stun:stun.epygi.com:3478 \
            utls-imitate=hellorandomizedalpn";
        let mut b = builder();
        assert_eq!(apply(&mut b, line, ports()), Ok(true));
    }
}
