import CardTexture from "@/components/ui/CardTexture";
import Chip from "@/components/ui/Chip";
import SectionHeader from "@/components/ui/SectionHeader";
import TextLink from "@/components/ui/TextLink";
import { useT, type TranslationKey } from "@/i18n";
import { useRichText } from "@/i18n/rich-text";
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
import { useMemo } from "react";
import { Link } from "react-router-dom";

const LINKS: {
  titleKey: TranslationKey;
  descKey: TranslationKey;
  href: string;
  internal?: boolean;
  Icon: LucideIcon;
}[] = [
  {
    titleKey: "home.explore.source.title",
    descKey: "home.explore.source.desc",
    Icon: Code,
    href: REPO_URL,
  },
  {
    titleKey: "home.explore.protocol.title",
    descKey: "home.explore.protocol.desc",
    Icon: FileText,
    href: REPO_LINKS.protocolsDoc,
  },
  {
    titleKey: "home.explore.architecture.title",
    descKey: "home.explore.architecture.desc",
    Icon: Layers,
    href: "/architecture",
    internal: true,
  },
  {
    titleKey: "home.explore.roadmap.title",
    descKey: "home.explore.roadmap.desc",
    Icon: Map,
    href: REPO_LINKS.roadmapDoc,
  },
  {
    titleKey: "home.explore.vision.title",
    descKey: "home.explore.vision.desc",
    Icon: Compass,
    href: REPO_LINKS.visionDoc,
  },
  {
    titleKey: "home.explore.brand.title",
    descKey: "home.explore.brand.desc",
    Icon: Palette,
    href: "/brand",
    internal: true,
  },
];

function AuditNotice() {
  const T = useT();
  const nodes = useMemo(
    () => ({
      headline: (
        <strong className="text-ink font-semibold">{T("home.explore.audit.headline")}</strong>
      ),
      review: (
        <TextLink href={REPO_LINKS.securityReview} tone="quiet">
          {T("home.explore.audit.link.review")}
        </TextLink>
      ),
      version: (
        <TextLink href={`${REPO_LINKS.roadmapDoc}#v190-security-hardening`}>v1.9.0</TextLink>
      ),
    }),
    [T],
  );

  return <>{useRichText("home.explore.audit.body", nodes)}</>;
}

export default function Explore() {
  const T = useT();

  return (
    <section id="explore" className="scroll-mt-8 px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={T("home.explore.eyebrow")}
          title={T("home.explore.title")}
          sub={T("home.explore.sub")}
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
            <Chip label={T("home.explore.audit.chip")} />
          </div>
          <p className="text-secondary relative mx-auto max-w-3xl text-center text-sm leading-relaxed">
            <AuditNotice />
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
                  <span className="text-ink block text-sm font-medium">{T(item.titleKey)}</span>
                  <span className="text-secondary mt-1.5 block text-[13px] leading-snug">
                    {T(item.descKey)}
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
                key={item.titleKey}
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
