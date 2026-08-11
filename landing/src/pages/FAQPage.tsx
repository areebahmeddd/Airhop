import PageHeader from "@/components/ui/PageHeader";
import TextLink from "@/components/ui/TextLink";
import { useSEO } from "@/hooks/useSEO";
import { useT } from "@/i18n";
import { FAQ_SECTIONS } from "@/i18n/content/en/faq";
import { useRichText } from "@/i18n/rich-text";
import { REPO_LINKS } from "@/lib/links";
import { SEO } from "@/lib/seo";
import { Plus } from "lucide-react";
import { isValidElement, useMemo } from "react";

function toPlainText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toPlainText).join(" ");
  if (isValidElement(node)) {
    return toPlainText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}

function faqAnswerText(node: React.ReactNode): string {
  return toPlainText(node).replace(/\s+/g, " ").trim();
}

function serializeSchema(schema: unknown): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}

function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_SECTIONS.flatMap((section) =>
      section.questions.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faqAnswerText(item.a),
        },
      })),
    ),
  };
}

function ContactLine() {
  const nodes = useMemo(
    () => ({
      email: <TextLink href="mailto:hi@areeb.dev">hi@areeb.dev</TextLink>,
      github: <TextLink href={REPO_LINKS.discussions}>GitHub</TextLink>,
    }),
    [],
  );

  return <>{useRichText("page.faq.contact", nodes)}</>;
}

export default function FAQPage() {
  const T = useT();
  const schema = useMemo(() => serializeSchema(faqSchema()), []);

  useSEO(SEO["/faq"]);

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <div className="mx-auto max-w-2xl px-6 py-16">
        <PageHeader
          eyebrow={T("page.faq.eyebrow")}
          title={T("page.faq.title")}
          meta={T("page.faq.meta")}
        />

        <div className="mt-12 space-y-8">
          {FAQ_SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2 className="text-mute mb-3 font-mono text-[11px] font-semibold tracking-[0.2em] uppercase">
                {section.heading}
              </h2>
              <div className="border-line bg-card divide-line divide-y overflow-hidden rounded-2xl border">
                {section.questions.map((item) => (
                  <details key={item.q} className="disclose group">
                    <summary className="hover:bg-card-subtle flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3.5 transition-colors duration-150">
                      <span className="text-ink text-sm font-medium">{item.q}</span>
                      <Plus
                        size={14}
                        strokeWidth={2}
                        className="text-mute shrink-0 transition-transform duration-150 group-open:rotate-45"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="text-secondary px-5 pb-4 text-sm leading-relaxed">{item.a}</div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="border-line mt-14 border-t pt-8">
          <p className="text-secondary text-sm">
            <ContactLine />
          </p>
        </div>
      </div>
    </main>
  );
}
