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
                over Bluetooth Low Energy mesh. It works with zero internet connectivity. Messages
                relay automatically across nearby devices, up to 7 hops.
              </p>
              <p>
                Your identity is an Ed25519 key pair generated on your device and stored in iOS
                Keychain or Android Keystore. There are no accounts, no registrations, and nothing
                that touches any server.
              </p>
              <p>
                Every session uses the Noise XX protocol for the handshake. Stored messages use
                Double Ratchet forward secrecy. No plaintext message content ever touches disk.
                Panic wipe destroys all keys and messages in under one second.
              </p>
            </div>

            <div className="space-y-6 font-mono text-sm leading-relaxed font-light text-gray-600 sm:text-base">
              <p>
                When you and a contact are out of Bluetooth range, Nostr relays serve as an internet
                bridge, using NIP-17 gift-wrapped direct messages. Tor is available on both iOS (via
                Arti) and Android (via Orbot).
              </p>
              <p>
                Airhop includes built-in offline payments. Ecash tokens travel the same Bluetooth
                mesh as messages. Send a payment to a contact with no internet. They redeem when
                back online.
              </p>
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
