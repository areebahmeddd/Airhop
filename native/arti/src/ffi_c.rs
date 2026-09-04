//! The C ABI, consumed by `ios/Airhop/AirhopTorManager.swift`.
//!
//! A small set of functions and one plain struct. There are no callbacks or
//! allocations that cross the FFI boundary, so no corresponding free function
//! is required. Swift polls `airhop_tor_status`, which acquires a lock and
//! copies the status, while the manager handles all other decisions.
//!
//! The header is generated from this file by cbindgen (`cbindgen.toml`) rather
//! than hand-written, so the two cannot drift.
//!
//! Every entry point runs inside `crate::catch_panic`: unwinding into a Swift
//! frame is undefined behaviour.

use std::ffi::{c_char, c_int, CStr};

/// Start Tor and bind its SOCKS5 listener on `127.0.0.1:socks_port`,
/// reaching the network through `bridge_lines` when any are given.
///
/// `bridge_lines` is a newline-separated list in standard Tor format; empty or
/// null is a direct connection to a public relay. `obfs4_port` and
/// `snowflake_port` are where the app already has each transport listening on
/// loopback, or `0` when it does not, and a line naming a transport whose port
/// is `0` is refused rather than started without it.
///
/// Returns `0` once the listener is accepting, which is before the first
/// circuit exists. Any other value is one of the `AIRHOP_TOR_ERR_*` codes. A bad
/// line stops the start: nothing binds and nothing bootstraps.
///
/// # Safety
///
/// `data_dir` must be a non-null, NUL-terminated C string, and `bridge_lines`
/// either null or the same. Both must stay valid for the duration of the call.
#[no_mangle]
pub unsafe extern "C" fn airhop_tor_start(
    data_dir: *const c_char,
    socks_port: u16,
    bridge_lines: *const c_char,
    obfs4_port: u16,
    snowflake_port: u16,
) -> c_int {
    crate::catch_panic(crate::AIRHOP_TOR_ERR_PANIC, || {
        if data_dir.is_null() {
            return crate::AIRHOP_TOR_ERR_DATA_DIR;
        }
        let Ok(dir) = (unsafe { CStr::from_ptr(data_dir) }).to_str() else {
            return crate::AIRHOP_TOR_ERR_DATA_DIR;
        };
        let lines = if bridge_lines.is_null() {
            ""
        } else {
            match (unsafe { CStr::from_ptr(bridge_lines) }).to_str() {
                Ok(s) => s,
                Err(_) => return crate::AIRHOP_TOR_ERR_BRIDGE_LINE,
            }
        };
        crate::start(
            dir,
            socks_port,
            lines,
            crate::TransportPorts {
                obfs4: obfs4_port,
                snowflake: snowflake_port,
            },
        )
    })
}

/// Stop Tor, drop its client and release the port. Returns `0`, or
/// `AIRHOP_TOR_ERR_NOT_RUNNING` when there was nothing to stop.
#[no_mangle]
pub extern "C" fn airhop_tor_stop() -> c_int {
    crate::catch_panic(crate::AIRHOP_TOR_ERR_PANIC, crate::stop)
}

/// Put Tor to sleep or wake it, for the app leaving and re-entering the
/// foreground. Returns `0`, or `AIRHOP_TOR_ERR_NOT_RUNNING`.
#[no_mangle]
pub extern "C" fn airhop_tor_set_dormant(dormant: bool) -> c_int {
    crate::catch_panic(crate::AIRHOP_TOR_ERR_PANIC, || crate::set_dormant(dormant))
}

/// The current status, packed into one word.
///
/// ```text
///   bit  0      running
///   bit  1      ready
///   bit  2      blocked
///   bit  3      bridged
///   bits 8..15  progress, 0 to 100
/// ```
///
/// Never fails, and is safe to call at any time including before a start and
/// after a stop, where it reports a stopped client rather than an error. That is
/// why it returns the status directly rather than a status code with an out
/// parameter: there is no failure for a caller to handle.
#[no_mangle]
pub extern "C" fn airhop_tor_status() -> c_int {
    // The fallback is a stopped client: a status word has no value a caller
    // could read as an error, and "not running" is the safe answer as well as
    // the true one.
    crate::catch_panic(0, crate::packed_status)
}

/// Copy Arti's current stage description into `buf` as a NUL-terminated string.
///
/// Returns the number of bytes written excluding the terminator, or a negative
/// error. Truncates on a short buffer instead of failing, and truncates on a
/// character boundary so the result is always valid UTF-8: this is display text,
/// and a clipped sentence beats no sentence.
///
/// # Safety
///
/// `buf` must be non-null and point at `len` writable bytes.
#[no_mangle]
pub unsafe extern "C" fn airhop_tor_summary(buf: *mut c_char, len: c_int) -> c_int {
    crate::catch_panic(crate::AIRHOP_TOR_ERR_PANIC, || {
        if buf.is_null() || len <= 0 {
            return crate::AIRHOP_TOR_ERR_DATA_DIR;
        }
        let summary = crate::status().summary;
        let capacity = (len - 1) as usize;
        let mut end = summary.len().min(capacity);
        while end > 0 && !summary.is_char_boundary(end) {
            end -= 1;
        }
        let bytes = &summary.as_bytes()[..end];
        unsafe {
            std::ptr::copy_nonoverlapping(bytes.as_ptr(), buf as *mut u8, end);
            buf.add(end).write(0);
        }
        end as c_int
    })
}

#[cfg(test)]
mod test {
    use super::*;

    /// Swift reads this with `String(cString:)`, which repairs a broken sequence
    /// rather than reporting it, so a bad cut only ever surfaces as mojibake.
    #[test]
    fn a_summary_is_truncated_on_a_character_boundary() {
        let _serial = crate::test_lock();
        // Three bytes per character, so a byte-count cut lands mid-sequence.
        crate::update_status(|s| s.summary = "\u{9375}\u{9375}\u{9375}".to_owned());

        // c_char, not i8: it is unsigned on ARM Linux.
        let mut buf = [0 as c_char; 8];
        let written = unsafe { airhop_tor_summary(buf.as_mut_ptr(), buf.len() as c_int) };

        // Two whole characters fit in seven bytes; the third does not.
        assert_eq!(written, 6);
        let bytes: Vec<u8> = buf[..written as usize].iter().map(|b| *b as u8).collect();
        assert_eq!(
            String::from_utf8(bytes).expect("valid UTF-8"),
            "\u{9375}\u{9375}"
        );
        assert_eq!(buf[written as usize], 0, "the result is NUL terminated");

        crate::update_status(|s| *s = crate::Status::default());
    }
}
