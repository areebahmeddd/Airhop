import { motion } from "motion/react";

export default function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center"
    >
      <span className="text-secondary font-mono text-[11px] font-semibold tracking-[0.2em] uppercase">
        {eyebrow}
      </span>
      <h2 className="text-ink text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {sub ? <p className="text-secondary max-w-xl text-[15px] leading-relaxed">{sub}</p> : null}
    </motion.div>
  );
}
