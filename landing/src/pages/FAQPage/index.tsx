import PageHeader from "@/components/ui/PageHeader";
import TextLink from "@/components/ui/TextLink";
import { useSEO } from "@/hooks/useSEO";
import { REPO_LINKS } from "@/lib/links";
import { SEO } from "@/lib/seo";
import { Plus } from "lucide-react";
import { isValidElement } from "react";
import { FAQ_SECTIONS } from "./content";

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

const FAQ_SCHEMA = {
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

export default function FAQPage() {
  useSEO(SEO["/faq"]);

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(FAQ_SCHEMA) }}
      />
      <div className="mx-auto max-w-2xl px-6 py-16">
        <PageHeader
          eyebrow="FAQ"
          title="Frequently asked questions"
          meta="Common questions about Airhop."
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
            Questions not answered here can be sent to{" "}
            <TextLink href="mailto:hi@areeb.dev">hi@areeb.dev</TextLink> or raised by opening a
            discussion on <TextLink href={REPO_LINKS.discussions}>GitHub</TextLink>.
          </p>
        </div>
      </div>
    </main>
  );
}
