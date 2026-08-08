import CardTexture from "@/components/ui/CardTexture";
import LeaderLabel from "@/components/ui/LeaderLabel";
import SectionHeader from "@/components/ui/SectionHeader";
import { LifeBuoy, Megaphone, Mountain, Tent } from "lucide-react";
import { motion } from "motion/react";

const SITUATIONS = [
  {
    label: "Disaster",
    Icon: LifeBuoy,
    line: "Towers are down. A notice on the board reaches whoever walks past.",
  },
  {
    label: "Off-grid",
    Icon: Mountain,
    line: "Two days into the trail. The last bar disappeared yesterday.",
  },
  {
    label: "Protest",
    Icon: Megaphone,
    line: "A QR code on a flyer opens an encrypted channel for the march.",
  },
  {
    label: "Festival",
    Icon: Tent,
    line: "No signal at the grounds. Messages hop through strangers' phones.",
  },
];

export default function Situations() {
  return (
    <section className="px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="When you need it"
          title="For the day the network goes down."
          sub="Natural disasters, internet blackouts, mass protests, or an ordinary weekend out of range."
        />
        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SITUATIONS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.2, delay: i * 0.05, ease: "easeOut" }}
              className="group border-line bg-card hover:border-line-strong relative flex min-h-[228px] flex-col overflow-hidden rounded-2xl border p-6 transition-colors duration-200"
            >
              <CardTexture Icon={s.Icon} />

              <div className="relative mt-auto">
                <LeaderLabel as="h3" index={i + 1} label={s.label} />
              </div>

              <p className="text-secondary relative mt-3 text-sm leading-relaxed">{s.line}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
