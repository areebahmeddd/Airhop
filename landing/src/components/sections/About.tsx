import SectionHeader from "@/components/ui/SectionHeader";
import TextLink from "@/components/ui/TextLink";
import { useT, type TranslationKey } from "@/i18n";
import { useRichText } from "@/i18n/rich-text";
import { REPO_LINKS } from "@/lib/links";
import { motion } from "motion/react";
import { useMemo } from "react";

function Paragraph({
  translationKey,
  nodes,
}: {
  translationKey: TranslationKey;
  nodes: Record<string, React.ReactNode>;
}) {
  return <>{useRichText(translationKey, nodes)}</>;
}

function Built() {
  const T = useT();
  const nodes = useMemo(
    () => ({
      mesh: (
        <TextLink href="https://en.wikipedia.org/wiki/Mesh_networking">
          {T("home.about.link.mesh")}
        </TextLink>
      ),
      bitchat: <TextLink href="https://bitchat.free">bitchat</TextLink>,
      wire_protocol: (
        <TextLink href={REPO_LINKS.protocolsDoc}>{T("home.about.link.wire_protocol")}</TextLink>
      ),
      ecash: <TextLink href="https://en.wikipedia.org/wiki/Ecash">ecash</TextLink>,
    }),
    [T],
  );

  return <Paragraph translationKey="home.about.body.built" nodes={nodes} />;
}

function Identity() {
  const nodes = useMemo(
    () => ({
      ed25519: <TextLink href="https://ed25519.cr.yp.to">Ed25519</TextLink>,
      ios_keychain: (
        <TextLink href="https://developer.apple.com/documentation/security/storing-keys-in-the-keychain">
          iOS Keychain
        </TextLink>
      ),
      android_keystore: (
        <TextLink href="https://developer.android.com/privacy-and-security/keystore">
          Android Keystore
        </TextLink>
      ),
    }),
    [],
  );

  return <Paragraph translationKey="home.about.body.identity" nodes={nodes} />;
}

function Crypto() {
  const nodes = useMemo(
    () => ({
      noise: <TextLink href="https://noiseprotocol.org/noise.html">Noise XX</TextLink>,
      ratchet: (
        <TextLink href="https://signal.org/docs/specifications/doubleratchet">
          Double Ratchet
        </TextLink>
      ),
    }),
    [],
  );

  return <Paragraph translationKey="home.about.body.crypto" nodes={nodes} />;
}

function Internet() {
  const nodes = useMemo(
    () => ({
      nostr: <TextLink href="https://nostr.org">Nostr</TextLink>,
      nip17: (
        <TextLink href="https://github.com/nostr-protocol/nips/blob/master/17.md">NIP-17</TextLink>
      ),
      tor: <TextLink href="https://torproject.org">Tor</TextLink>,
      arti: <TextLink href="https://gitlab.torproject.org/tpo/core/arti">Arti</TextLink>,
      obfs4: (
        <TextLink href="https://gitlab.torproject.org/tpo/anti-censorship/pluggable-transports/obfs4">
          obfs4
        </TextLink>
      ),
      snowflake: <TextLink href="https://snowflake.torproject.org">Snowflake</TextLink>,
    }),
    [],
  );

  return <Paragraph translationKey="home.about.body.internet" nodes={nodes} />;
}

function Payments() {
  const nodes = useMemo(
    () => ({ cashu: <TextLink href="https://cashu.space">Cashu</TextLink> }),
    [],
  );

  return <Paragraph translationKey="home.about.optional.payments.body" nodes={nodes} />;
}

export default function About() {
  const T = useT();

  return (
    <section id="about" className="px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={T("home.about.eyebrow")}
          title={T("home.about.title")}
          sub={T("home.about.sub")}
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="border-line bg-card mx-auto mt-10 max-w-6xl overflow-hidden rounded-2xl border"
        >
          <div className="border-line border-b px-6 py-3 select-none">
            <p className="label text-secondary text-[10px] font-bold tracking-widest">
              &#9679; {T("home.about.card")}
            </p>
          </div>

          <div className="divide-line grid grid-cols-1 md:grid-cols-2 md:divide-x">
            <div className="text-secondary mono space-y-5 p-6 text-[13px] leading-relaxed sm:p-8">
              <p>
                <Built />
              </p>
              <p>
                <Identity />
              </p>
              <p>
                <Crypto />
              </p>
            </div>

            <div className="text-secondary border-line mono space-y-5 border-t p-6 text-[13px] leading-relaxed sm:p-8 md:border-t-0">
              <p>
                <Internet />
              </p>
              <div>
                <p className="text-ink font-semibold">{T("home.about.optional.title")}</p>
                <ol className="mt-3 list-decimal space-y-2 ps-5">
                  <li>
                    <span className="text-ink font-semibold">
                      {T("home.about.optional.payments.label")}
                    </span>{" "}
                    <Payments />
                  </li>
                  <li>
                    <span className="text-ink font-semibold">
                      {T("home.about.optional.ai.label")}
                    </span>{" "}
                    {T("home.about.optional.ai.body")}
                  </li>
                </ol>
              </div>
              <p>{T("home.about.body.compatible")}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
