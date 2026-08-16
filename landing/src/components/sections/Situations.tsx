import CardTexture from "@/components/ui/CardTexture";
import LeaderLabel from "@/components/ui/LeaderLabel";
import SectionHeader from "@/components/ui/SectionHeader";
import { useT, type TranslationKey } from "@/i18n";
import { LifeBuoy, Megaphone, Mountain, Tent } from "lucide-react";
import { motion } from "motion/react";

const SITUATIONS: { labelKey: TranslationKey; lineKey: TranslationKey; Icon: typeof LifeBuoy }[] = [
  {
    labelKey: "home.situations.disaster.label",
    lineKey: "home.situations.disaster.line",
    Icon: LifeBuoy,
  },
  {
    labelKey: "home.situations.offgrid.label",
    lineKey: "home.situations.offgrid.line",
    Icon: Mountain,
  },
  {
    labelKey: "home.situations.protest.label",
    lineKey: "home.situations.protest.line",
    Icon: Megaphone,
  },
  {
    labelKey: "home.situations.festival.label",
    lineKey: "home.situations.festival.line",
    Icon: Tent,
  },
];

export default function Situations() {
  const T = useT();

  return (
    <section className="px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={T("home.situations.eyebrow")}
          title={T("home.situations.title")}
          sub={T("home.situations.sub")}
        />
        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SITUATIONS.map((s, i) => (
            <motion.div
              key={s.labelKey}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.2, delay: i * 0.05, ease: "easeOut" }}
              className="group border-line bg-card hover:border-line-strong relative flex min-h-[228px] flex-col overflow-hidden rounded-2xl border p-6 transition-colors duration-200"
            >
              <CardTexture Icon={s.Icon} />

              <div className="relative mt-auto">
                <LeaderLabel as="h3" index={i + 1} label={T(s.labelKey)} />
              </div>

              <p className="text-secondary relative mt-3 text-sm leading-relaxed">{T(s.lineKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
