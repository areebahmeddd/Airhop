import CardTexture from "@/components/ui/CardTexture";
import Chip from "@/components/ui/Chip";
import SectionHeader from "@/components/ui/SectionHeader";
import TextLink from "@/components/ui/TextLink";
import { REPO_LINKS, REPO_URL } from "@/lib/links";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Code,
  Compass,
  FileText,
  Layers,
  Map,
  Palette,
  ShieldAlert,
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const LINKS: {
  title: string;
  desc: string;
  href: string;
  internal?: boolean;
  Icon: LucideIcon;
}[] = [
  {
    title: "Source code",
    Icon: Code,
    desc: "Everything on GitHub under MIT. Issues, pull requests, and discussions open.",
    href: REPO_URL,
  },
  {
    title: "Protocol spec",
    Icon: FileText,
    desc: "The exact wire format, BLE UUIDs, and constants, shared with bitchat.",
    href: REPO_LINKS.protocolsDoc,
  },
  {
    title: "Architecture",
    Icon: Layers,
    desc: "The full technical breakdown, from tapping send to the bytes on the radio.",
    href: "/architecture",
    internal: true,
  },
  {
    title: "Roadmap",
    Icon: Map,
    desc: "Version targets from v0.5.0 to v2.0.0, including the planned audit.",
    href: REPO_LINKS.roadmapDoc,
  },
  {
    title: "Vision",
    Icon: Compass,
    desc: "Why Airhop exists, and the principles that do not change under pressure.",
    href: REPO_LINKS.visionDoc,
  },
  {
    title: "Brand kit",
    Icon: Palette,
    desc: "The pixel bird, color and type tokens, press assets and boilerplate.",
    href: "/brand",
    internal: true,
  },
];

export default function Explore() {
  return (
    <section id="explore" className="scroll-mt-8 px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Open and honest"
          title="Every claim here is checkable."
          sub="The code, protocol, and plans are public. So are the limitations. Check them yourself before taking our word for it."
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="group border-line bg-card hover:border-line-strong relative mx-auto mt-10 max-w-6xl overflow-hidden rounded-2xl border p-6 transition-colors duration-200 sm:p-8"
        >
          <CardTexture Icon={ShieldAlert} />

          <div className="relative mb-4 flex justify-center">
            <Chip label="Audit pending" />
          </div>
          <p className="text-secondary relative mx-auto max-w-3xl text-center text-sm leading-relaxed">
            <strong className="text-ink font-semibold">
              Airhop has not yet had an external security audit.
            </strong>{" "}
            All code is personally reviewed and run through a{" "}
            <TextLink href={REPO_LINKS.securityReview} tone="quiet">
              security review agent
            </TextLink>{" "}
            before shipping, and the cryptographic library it uses is Cure53 audited, but that is
            not a substitute for a formal audit of the app itself. One is planned for{" "}
            <TextLink href={`${REPO_LINKS.roadmapDoc}#v190-security-hardening`}>v1.9.0</TextLink>.
            Do not rely on it for sensitive use cases until then.
          </p>
        </motion.div>

        <div className="mx-auto mt-4 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map((item, i) => {
            const cardClass =
              "group relative flex min-h-[152px] items-start justify-between gap-3 overflow-hidden rounded-2xl border border-line bg-card p-6 transition-colors duration-200 hover:border-line-strong hover:bg-card-subtle";
            const body = (
              <>
                <CardTexture Icon={item.Icon} corner="bottom" />

                <span className="relative min-w-0">
                  <span className="text-ink block text-sm font-medium">{item.title}</span>
                  <span className="text-secondary mt-1.5 block text-[13px] leading-snug">
                    {item.desc}
                  </span>
                </span>
                <ArrowUpRight
                  size={14}
                  className="text-secondary group-hover:text-ink relative mt-0.5 flex-shrink-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </>
            );
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.2, delay: i * 0.04, ease: "easeOut" }}
              >
                {item.internal ? (
                  <Link to={item.href} className={cardClass}>
                    {body}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardClass}
                  >
                    {body}
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
