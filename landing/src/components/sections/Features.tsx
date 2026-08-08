import CardTexture from "@/components/ui/CardTexture";
import Chip from "@/components/ui/Chip";
import SectionHeader from "@/components/ui/SectionHeader";
import type { LucideIcon } from "lucide-react";
import { Bluetooth, Globe, KeyRound, MessageCircle, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";

interface FeatureGroup {
  title: string;
  summary: string;
  span: string;
  cols: string;
  Icon: LucideIcon;
  items: { name: string; line: string }[];
}

const GROUPS: FeatureGroup[] = [
  {
    title: "Messaging",
    summary: "Everything a messenger has, with zero infrastructure behind it.",
    span: "lg:col-span-12",
    cols: "sm:grid-cols-2 lg:grid-cols-4",
    Icon: MessageCircle,
    items: [
      { name: "Private DMs", line: "End to end encrypted, with delivery and read receipts." },
      { name: "Location channels", line: "Rooms tied to a place, from one block to a region." },
      {
        name: "Private channels and groups",
        line: "Invite links for a room, or a signed list of up to 16.",
      },
      { name: "Bulletin board", line: "Notices pinned to an area for up to seven days." },
      {
        name: "Live voice",
        line: "Hold the mic and talk to anyone in range, walkie-talkie style.",
      },
      { name: "Voice notes", line: "Recorded audio, faster than typing directions." },
      { name: "Photos, video and files", line: "Any format, up to 1 MB, with no signal needed." },
      {
        name: "Store-and-forward",
        line: "Sealed and carried by a nearby phone until it reaches them.",
      },
    ],
  },
  {
    title: "Identity",
    summary: "Nothing to register, nothing to seize.",
    span: "lg:col-span-6",
    cols: "sm:grid-cols-2",
    Icon: KeyRound,
    items: [
      {
        name: "Key pair identity",
        line: "Made on this phone, stored in the OS keychain.",
      },
      { name: "Human-readable names", line: "Derived from your key, so nobody can take yours." },
      { name: "QR contacts", line: "One scan carries their keys, not just their name." },
      { name: "Panic wipe", line: "Every key and message destroyed in under a second." },
    ],
  },
  {
    title: "Networking",
    summary: "The phones are the network.",
    span: "lg:col-span-6",
    cols: "sm:grid-cols-2",
    Icon: Bluetooth,
    items: [
      { name: "Bluetooth mesh", line: "No internet, no router, on phones people already own." },
      { name: "Mesh bridge", line: "Links your public chat with a nearby crowd out of range." },
      { name: "WiFi fast path", line: "Faster transfers between two Androids or two iPhones." },
      { name: "bitchat compatible", line: "Both apps join the same mesh with no setup." },
    ],
  },
  {
    title: "Internet",
    summary: "An extension, never a requirement.",
    span: "lg:col-span-7",
    cols: "sm:grid-cols-2",
    Icon: Globe,
    items: [
      {
        name: "Nostr fallback",
        line: "DMs and location channels keep flowing beyond radio range.",
      },
      { name: "Geo-relay discovery", line: "300+ independent public relays, none of them ours." },
      {
        name: "Internet gateway",
        line: "Lend your connection so a nearby offline phone reaches location channels.",
      },
      {
        name: "Tor integration",
        line: "Routed on both platforms, so relays never see your IP.",
      },
    ],
  },
  {
    title: "Optional",
    summary: "Off by default. On when you want it.",
    span: "lg:col-span-5",
    cols: "sm:grid-cols-2",
    Icon: SlidersHorizontal,
    items: [
      { name: "Cashu ecash", line: "Pay the person beside you with neither phone online." },
      { name: "Lightning", line: "Top up or cash out in bitcoin over the Lightning network." },
      { name: "Local AI", line: "On-device answers, nothing leaves the phone." },
      { name: "Social bridges", line: "Bluesky and Mastodon with the same identity." },
    ],
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-8 px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="What it does"
          title="A real messenger, not a demo."
          sub="Chat, identity, networking, and money. All of it built to work with no signal, no account, and nothing in the middle."
        />

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-12">
          {GROUPS.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.2, delay: gi * 0.04, ease: "easeOut" }}
              className={`group border-line bg-card hover:border-line-strong relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-colors duration-200 sm:p-7 ${group.span}`}
            >
              <CardTexture Icon={group.Icon} />

              <div className="relative">
                <Chip as="h3" label={group.title} />
                <p className="text-secondary mt-3 text-[13px] leading-snug">{group.summary}</p>
              </div>
              <dl
                className={`border-line relative mt-5 grid flex-1 gap-x-10 gap-y-4 border-t pt-5 ${group.cols}`}
              >
                {group.items.map((item) => (
                  <div key={item.name} className="flex flex-col gap-0.5">
                    <dt className="text-ink text-sm font-medium">{item.name}</dt>
                    <dd className="text-secondary text-[13px] leading-snug">{item.line}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
