import { motion } from "motion/react";

export default function About() {
  return (
    <section id="about" className="bg-white px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="font-mono text-xs font-semibold tracking-[0.25em] text-gray-500 uppercase">
            WHAT IS AIRHOP
          </div>

          <h2 className="max-w-5xl text-xl leading-snug font-extrabold tracking-tight text-black sm:text-2xl md:text-3xl">
            Most communication apps depend on central servers. They can be surveilled, shut down, or
            blocked. Airhop does not.
          </h2>

          <div className="grid grid-cols-1 gap-8 pt-4 md:grid-cols-2 md:gap-12">
            <div className="space-y-6 font-mono text-sm leading-relaxed font-light text-gray-600 sm:text-base">
              <p>
                Airhop is an open-source iOS and Android app for private, peer-to-peer messaging
                over{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Mesh_networking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  Bluetooth Low Energy mesh
                </a>
                . It's built on the foundation of{" "}
                <a
                  href="https://bitchat.free"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  bitchat
                </a>
                , reusing its{" "}
                <a
                  href="https://github.com/areebahmeddd/Airhop/blob/main/docs/spec/PROTOCOLS.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  BLE wire protocol
                </a>{" "}
                and security model, then extending it with Tor, offline payments, and offline AI. It
                works with zero internet connectivity, and messages relay automatically across
                nearby devices (roughly 30 to 50 meters per hop), up to 7 hops.
              </p>
              <p>
                Your identity is an{" "}
                <a
                  href="https://ed25519.cr.yp.to"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  Ed25519
                </a>{" "}
                key pair generated on your device and stored in{" "}
                <a
                  href="https://developer.apple.com/documentation/security/storing-keys-in-the-keychain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  iOS Keychain
                </a>{" "}
                or{" "}
                <a
                  href="https://developer.android.com/privacy-and-security/keystore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  Android Keystore
                </a>
                . There are no accounts, no registrations, and nothing that touches any server.
              </p>
              <p>
                Every session uses the{" "}
                <a
                  href="https://noiseprotocol.org/noise.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  Noise XX
                </a>{" "}
                protocol for an authenticated handshake. Stored messages use{" "}
                <a
                  href="https://signal.org/docs/specifications/doubleratchet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  Double Ratchet
                </a>{" "}
                algorithm, i.e. even if your device is compromised later, your past messages stay
                unreadable. Panic wipe destroys all keys and messages in under one second.
              </p>
            </div>

            <div className="space-y-6 font-mono text-sm leading-relaxed font-light text-gray-600 sm:text-base">
              <p>
                When you and a contact are out of Bluetooth range,{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Nostr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  Nostr
                </a>{" "}
                relays serve as an internet bridge, using{" "}
                <a
                  href="https://github.com/nostr-protocol/nips/blob/master/17.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  NIP-17
                </a>{" "}
                gift-wrapped direct messages.{" "}
                <a
                  href="https://torproject.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  Tor
                </a>{" "}
                support is also available on both iOS (via{" "}
                <a
                  href="https://arti.torproject.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  Arti
                </a>
                ) and Android (via{" "}
                <a
                  href="https://guardianproject.info/apps/org.torproject.android/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                >
                  Orbot
                </a>
                ).
              </p>
              <div>
                <p className="font-semibold text-gray-900">
                  Airhop has optional features you can enable:
                </p>
                <ol className="mt-3 list-decimal space-y-2 pl-5">
                  <li>
                    <span className="font-semibold text-gray-900">Offline Payments:</span> Send and
                    receive payments offline using the{" "}
                    <a
                      href="https://cashu.space"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                    >
                      Cashu
                    </a>{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Ecash"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 underline underline-offset-2 transition-colors hover:text-gray-600"
                    >
                      ecash
                    </a>{" "}
                    protocol (Bitcoin only).
                  </li>
                  <li>
                    <span className="font-semibold text-gray-900">Offline AI:</span> A small
                    on-device AI assistant that can answer important questions even when you're
                    offline. All processing and data stay on your device.
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
