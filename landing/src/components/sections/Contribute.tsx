import CardTexture from "@/components/ui/CardTexture";
import Chip from "@/components/ui/Chip";
import SectionHeader from "@/components/ui/SectionHeader";
import { REPO_URL, SITE_URL, SPONSOR_URL } from "@/lib/links";
import { ArrowUpRight, GitPullRequest, Heart } from "lucide-react";
import { motion } from "motion/react";

const DODO_PRODUCT_ID = "pdt_0NkbLWhlAvN1028Lzqwed";

const DODO_CHECKOUT_URL =
  `https://checkout.dodopayments.com/buy/${DODO_PRODUCT_ID}` +
  `?quantity=1&redirect_url=${encodeURIComponent(`${SITE_URL}/#support`)}`;

const BUTTON_PRIMARY =
  "group/btn inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-canvas transition-opacity duration-150 hover:opacity-90";
const BUTTON_QUIET =
  "group/btn inline-flex h-11 items-center gap-2 rounded-full border border-line bg-inner px-6 text-sm font-medium text-ink transition-colors duration-150 hover:border-line-strong hover:bg-hover";

const BUTTON_ARROW =
  "transition-transform duration-150 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5";

export default function Contribute() {
  return (
    <section id="support" className="scroll-mt-8 px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Support this project"
          title="Independent, and in the open."
          sub="There are no investors, no ads, and no paid tier. Every feature stays free either way, and the work is funded by the people who find it useful."
        />

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="group border-line bg-card hover:border-line-strong relative flex flex-col gap-3 overflow-hidden rounded-2xl border p-6 transition-colors duration-200 sm:p-8"
          >
            <CardTexture Icon={GitPullRequest} />

            <div className="relative">
              <Chip as="h3" label="Contribute" />
            </div>
            <p className="text-secondary relative flex-1 text-sm leading-relaxed">
              Star the repo, open issues, and submit pull requests. Bug reports, feature proposals,
              and code contributions are all welcome.
            </p>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${BUTTON_QUIET} relative w-fit`}
            >
              View on GitHub
              <ArrowUpRight size={14} aria-hidden="true" className={BUTTON_ARROW} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
            className="group border-line bg-card hover:border-line-strong relative flex flex-col gap-3 overflow-hidden rounded-2xl border p-6 transition-colors duration-200 sm:p-8"
          >
            <CardTexture Icon={Heart} />

            <div className="relative">
              <Chip as="h3" label="Sponsor" />
            </div>
            <p className="text-secondary relative flex-1 text-sm leading-relaxed">
              If Airhop is useful to you, a one-time donation or a recurring sponsorship goes a long
              way toward keeping development active.
            </p>
            <div className="relative flex flex-wrap gap-3">
              <a
                href={DODO_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={BUTTON_PRIMARY}
              >
                Donate once
                <ArrowUpRight size={14} aria-hidden="true" className={BUTTON_ARROW} />
              </a>
              <a
                href={SPONSOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={BUTTON_QUIET}
              >
                Sponsor on GitHub
                <ArrowUpRight size={14} aria-hidden="true" className={BUTTON_ARROW} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
