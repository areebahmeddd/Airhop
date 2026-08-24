import CardTexture from "@/components/ui/CardTexture";
import Chip from "@/components/ui/Chip";
import SectionHeader from "@/components/ui/SectionHeader";
import { useT, type TranslationKey } from "@/i18n";
import type { LucideIcon } from "lucide-react";
import { Bluetooth, Globe, KeyRound, MessageCircle, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";

interface FeatureGroup {
  titleKey: TranslationKey;
  summaryKey: TranslationKey;
  span: string;
  cols: string;
  Icon: LucideIcon;
  items: { nameKey: TranslationKey; lineKey: TranslationKey }[];
}

const GROUPS: FeatureGroup[] = [
  {
    titleKey: "home.features.messaging.title",
    summaryKey: "home.features.messaging.summary",
    span: "lg:col-span-12",
    cols: "sm:grid-cols-2 lg:grid-cols-4",
    Icon: MessageCircle,
    items: [
      {
        nameKey: "home.features.messaging.dms.name",
        lineKey: "home.features.messaging.dms.line",
      },
      {
        nameKey: "home.features.messaging.location.name",
        lineKey: "home.features.messaging.location.line",
      },
      {
        nameKey: "home.features.messaging.groups.name",
        lineKey: "home.features.messaging.groups.line",
      },
      {
        nameKey: "home.features.messaging.board.name",
        lineKey: "home.features.messaging.board.line",
      },
      {
        nameKey: "home.features.messaging.voice.name",
        lineKey: "home.features.messaging.voice.line",
      },
      {
        nameKey: "home.features.messaging.notes.name",
        lineKey: "home.features.messaging.notes.line",
      },
      {
        nameKey: "home.features.messaging.files.name",
        lineKey: "home.features.messaging.files.line",
      },
      {
        nameKey: "home.features.messaging.forward.name",
        lineKey: "home.features.messaging.forward.line",
      },
    ],
  },
  {
    titleKey: "home.features.identity.title",
    summaryKey: "home.features.identity.summary",
    span: "lg:col-span-6",
    cols: "sm:grid-cols-2",
    Icon: KeyRound,
    items: [
      {
        nameKey: "home.features.identity.keys.name",
        lineKey: "home.features.identity.keys.line",
      },
      {
        nameKey: "home.features.identity.names.name",
        lineKey: "home.features.identity.names.line",
      },
      { nameKey: "home.features.identity.qr.name", lineKey: "home.features.identity.qr.line" },
      {
        nameKey: "home.features.identity.panic.name",
        lineKey: "home.features.identity.panic.line",
      },
    ],
  },
  {
    titleKey: "home.features.networking.title",
    summaryKey: "home.features.networking.summary",
    span: "lg:col-span-6",
    cols: "sm:grid-cols-2",
    Icon: Bluetooth,
    items: [
      {
        nameKey: "home.features.networking.mesh.name",
        lineKey: "home.features.networking.mesh.line",
      },
      {
        nameKey: "home.features.networking.bridge.name",
        lineKey: "home.features.networking.bridge.line",
      },
      {
        nameKey: "home.features.networking.wifi.name",
        lineKey: "home.features.networking.wifi.line",
      },
      {
        nameKey: "home.features.networking.bitchat.name",
        lineKey: "home.features.networking.bitchat.line",
      },
    ],
  },
  {
    titleKey: "home.features.internet.title",
    summaryKey: "home.features.internet.summary",
    span: "lg:col-span-7",
    cols: "sm:grid-cols-2",
    Icon: Globe,
    items: [
      {
        nameKey: "home.features.internet.nostr.name",
        lineKey: "home.features.internet.nostr.line",
      },
      {
        nameKey: "home.features.internet.relays.name",
        lineKey: "home.features.internet.relays.line",
      },
      {
        nameKey: "home.features.internet.gateway.name",
        lineKey: "home.features.internet.gateway.line",
      },
      {
        nameKey: "home.features.internet.tor.name",
        lineKey: "home.features.internet.tor.line",
      },
    ],
  },
  {
    titleKey: "home.features.optional.title",
    summaryKey: "home.features.optional.summary",
    span: "lg:col-span-5",
    cols: "sm:grid-cols-2",
    Icon: SlidersHorizontal,
    items: [
      {
        nameKey: "home.features.optional.cashu.name",
        lineKey: "home.features.optional.cashu.line",
      },
      {
        nameKey: "home.features.optional.lightning.name",
        lineKey: "home.features.optional.lightning.line",
      },
      { nameKey: "home.features.optional.ai.name", lineKey: "home.features.optional.ai.line" },
      {
        nameKey: "home.features.optional.social.name",
        lineKey: "home.features.optional.social.line",
      },
    ],
  },
];

export default function Features() {
  const T = useT();

  return (
    <section id="features" className="px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={T("home.features.eyebrow")}
          title={T("home.features.title")}
          sub={T("home.features.sub")}
        />

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-12">
          {GROUPS.map((group, gi) => (
            <motion.div
              key={group.titleKey}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.2, delay: gi * 0.04, ease: "easeOut" }}
              className={`group border-line bg-card hover:border-line-strong relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-colors duration-200 sm:p-7 ${group.span}`}
            >
              <CardTexture Icon={group.Icon} />

              <div className="relative">
                <Chip as="h3" label={T(group.titleKey)} />
                <p className="text-secondary mt-3 text-[13px] leading-snug">
                  {T(group.summaryKey)}
                </p>
              </div>
              <dl
                className={`border-line relative mt-5 grid flex-1 gap-x-10 gap-y-4 border-t pt-5 ${group.cols}`}
              >
                {group.items.map((item) => (
                  <div key={item.nameKey} className="flex flex-col gap-0.5">
                    <dt className="text-ink text-sm font-medium">{T(item.nameKey)}</dt>
                    <dd className="text-secondary text-[13px] leading-snug">{T(item.lineKey)}</dd>
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
