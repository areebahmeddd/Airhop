import SectionHeader from "@/components/ui/SectionHeader";
import TextLink from "@/components/ui/TextLink";
import { REPO_LINKS } from "@/lib/links";
import { motion } from "motion/react";

export default function About() {
  return (
    <section id="about" className="scroll-mt-8 px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="What is Airhop"
          title="Most apps depend on a central server."
          sub="A server can be surveilled, shut down, or blocked. Airhop does not have one, so there is no company to pressure and no service to close."
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="border-line bg-card mx-auto mt-10 max-w-6xl overflow-hidden rounded-2xl border"
        >
          <div className="border-line border-b px-6 py-3 select-none">
            <p className="text-secondary font-mono text-[10px] font-bold tracking-widest uppercase">
              &#9679; Technical overview
            </p>
          </div>

          <div className="divide-line grid grid-cols-1 md:grid-cols-2 md:divide-x">
            <div className="text-secondary space-y-5 p-6 font-mono text-[13px] leading-relaxed sm:p-8">
              <p>
                Airhop is an open-source iOS and Android app for private, peer-to-peer messaging
                over{" "}
                <TextLink href="https://en.wikipedia.org/wiki/Mesh_networking">
                  Bluetooth Low Energy mesh
                </TextLink>
                . It is built on the foundation of{" "}
                <TextLink href="https://bitchat.free">bitchat</TextLink>, reusing its{" "}
                <TextLink href={REPO_LINKS.protocolsDoc}>wire protocol</TextLink> and security
                model, then extending it with Tor, offline{" "}
                <TextLink href="https://en.wikipedia.org/wiki/Ecash">ecash</TextLink> payments, and
                offline AI. It works with zero internet connectivity, and messages relay
                automatically across nearby devices (roughly 10 to 30 meters per hop indoors,
                further in the open), up to 7 hops.
              </p>
              <p>
                Your identity is an <TextLink href="https://ed25519.cr.yp.to">Ed25519</TextLink> key
                pair generated on your device and stored in{" "}
                <TextLink href="https://developer.apple.com/documentation/security/storing-keys-in-the-keychain">
                  iOS Keychain
                </TextLink>{" "}
                or{" "}
                <TextLink href="https://developer.android.com/privacy-and-security/keystore">
                  Android Keystore
                </TextLink>
                . There are no accounts, no registrations, and nothing that touches any server, i.e.
                it can be used as a burner app that leaves nothing linking back to your activity
                once deleted.
              </p>
              <p>
                Every session uses the{" "}
                <TextLink href="https://noiseprotocol.org/noise.html">Noise XX</TextLink> protocol
                for an authenticated handshake. Stored messages use the{" "}
                <TextLink href="https://signal.org/docs/specifications/doubleratchet">
                  Double Ratchet
                </TextLink>{" "}
                algorithm, i.e. even if your device is compromised later, your past messages stay
                unreadable. Panic wipe destroys all keys and messages in under one second.
              </p>
            </div>

            <div className="text-secondary border-line space-y-5 border-t p-6 font-mono text-[13px] leading-relaxed sm:p-8 md:border-t-0">
              <p>
                When you and a contact are out of Bluetooth range,{" "}
                <TextLink href="https://nostr.org">Nostr</TextLink> relays serve as an internet
                bridge, using{" "}
                <TextLink href="https://github.com/nostr-protocol/nips/blob/master/17.md">
                  NIP-17
                </TextLink>
                -shaped gift-wrapped direct messages, so the mesh extends globally whenever both of
                you are online. <TextLink href="https://torproject.org">Tor</TextLink> support is
                also available on both iOS (via{" "}
                <TextLink href="https://gitlab.torproject.org/tpo/core/arti">Arti</TextLink>) and
                Android (via{" "}
                <TextLink href="https://guardianproject.info/apps/org.torproject.android">
                  Orbot
                </TextLink>
                ).
              </p>
              <div>
                <p className="text-ink font-semibold">
                  Airhop has optional features you can enable:
                </p>
                <ol className="mt-3 list-decimal space-y-2 pl-5">
                  <li>
                    <span className="text-ink font-semibold">Offline Payments:</span> Send and
                    receive payments over the mesh using the{" "}
                    <TextLink href="https://cashu.space">Cashu</TextLink> protocol (Bitcoin only).
                  </li>
                  <li>
                    <span className="text-ink font-semibold">Offline AI:</span> A small on-device AI
                    assistant that can answer important questions. All processing and data stay on
                    your device.
                  </li>
                </ol>
              </div>
              <p>
                Airhop is wire-compatible with bitchat. An Airhop device and a bitchat device on the
                same mesh discover each other automatically and can exchange messages and direct
                messages with zero configuration.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
