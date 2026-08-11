import PageHeader from "@/components/ui/PageHeader";
import TextLink from "@/components/ui/TextLink";
import { useSEO } from "@/hooks/useSEO";
import { useT } from "@/i18n";
import { REPO_LINKS, REPO_URL } from "@/lib/links";
import { LAST_UPDATED_DISPLAY, SEO } from "@/lib/seo";

export default function TermsPage() {
  const T = useT();

  useSEO(SEO["/terms-of-service"]);

  return (
    <main id="main-content">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <PageHeader
          eyebrow={T("page.legal.eyebrow")}
          title={T("page.terms.title")}
          meta={T("common.last_updated", { date: LAST_UPDATED_DISPLAY })}
        />

        <div className="text-secondary mt-14">
          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">About Airhop</h2>
            <p className="text-[15px] leading-[1.75]">
              Airhop is a free, open-source mobile application for offline peer-to-peer
              communication over Bluetooth mesh networks, built on the foundation of{" "}
              <TextLink href="https://bitchat.free" tone="quiet">
                bitchat
              </TextLink>
              . It is an independent project, not backed by any company. By using this website or
              the Airhop app, you agree to these terms.
            </p>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Acceptable use</h2>
            <p className="text-[15px] leading-[1.75]">
              You may use Airhop for lawful purposes only. You are responsible for complying with
              the laws of your jurisdiction, including any regulations governing encrypted
              communications, radio frequency use, and peer-to-peer networks. Do not use Airhop to
              facilitate illegal activity or to harm others.
            </p>
            <p className="text-[15px] leading-[1.75]">
              This website is for informational purposes. Do not use automated tools to
              bulk-download or scrape content from it.
            </p>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Content you post</h2>
            <p className="text-[15px] leading-[1.75]">
              Public channels, location channels, and bulletin-board notices are visible to anyone
              in range or in the same area, including people using other compatible apps. Treat
              anything posted there as public. You are responsible for what you post.
            </p>
            <p className="text-[15px] leading-[1.75]">
              <strong>
                There is no central server, so we cannot moderate, edit, or delete what you or
                anyone else sends.
              </strong>{" "}
              Deleting your own notice broadcasts a signed retraction that other devices honour, and
              notices expire on their own, but a copy that has already reached another device may
              remain there.
            </p>
            <p className="text-[15px] leading-[1.75]">
              If you turn on the internet gateway or the mesh bridge, your device relays other
              people&apos;s public messages over the internet: location-channel traffic for the
              gateway, public #bluetooth chat for the bridge. You do not author that content and
              cannot control it.
            </p>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Payments</h2>
            <p className="text-[15px] leading-[1.75]">
              Airhop includes an optional Cashu ecash wallet.{" "}
              <strong>
                We do not operate any payment infrastructure. We are not a financial institution,
                payment processor, money services business, or custodian of your funds.
              </strong>{" "}
              We have no ability to reverse, recover, freeze, or mediate any transaction.
            </p>
            <p className="text-[15px] leading-[1.75]">
              <strong>Mints are third parties you choose.</strong> A mint is an independent server
              that issues and redeems ecash and holds the bitcoin backing it. Airhop ships with no
              default mint and does not endorse, vet, or monitor any of them. Adding a mint means
              trusting that operator with whatever balance you keep there. A mint may go offline,
              refuse service, change its fees, or fail to honour its tokens, and any loss that
              follows is between you and that operator.
            </p>
            <p className="text-[15px] leading-[1.75]">
              <strong>Ecash is a bearer instrument.</strong> Whoever holds a token can spend it. A
              token sent to the wrong person, posted to a public channel, or read by someone over
              your shoulder is gone. Transfers over the mesh are final and cannot be reversed by
              anyone.
            </p>
            <p className="text-[15px] leading-[1.75]">
              <strong>Recovery is your responsibility.</strong> The optional recovery phrase is the
              only way to rebuild a balance on another device. It is stored on your device and
              nowhere else. We cannot recover it, reset it, or help you if it is lost, and anyone
              who obtains it can spend your balance.
            </p>
            <p className="text-[15px] leading-[1.75]">
              <strong>Lightning deposits and withdrawals</strong> are performed by your chosen mint
              and the wider Lightning Network, not by us. Routing fees, failed payments, and
              settlement delays are outside our control.
            </p>
            <p className="text-[15px] leading-[1.75]">
              You are responsible for complying with any tax, reporting, or financial regulations
              that apply to you.
            </p>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">No warranty</h2>
            <p className="text-[15px] leading-[1.75]">
              Airhop is provided &quot;as is&quot; without any warranty of any kind. We make no
              guarantees about reliability, availability, or fitness for a particular purpose.
            </p>
            <p className="text-[15px] leading-[1.75]">
              The app has not been formally security-audited by an external firm. An audit is
              planned but has not been completed.{" "}
              <strong>
                Do not rely on Airhop as your only means of communication in life-safety situations.
              </strong>
            </p>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Limitation of liability</h2>
            <p className="text-[15px] leading-[1.75]">
              To the fullest extent permitted by applicable law, we are not liable for any direct,
              indirect, incidental, or consequential damages arising from your use of this website
              or the Airhop app, including loss of data, failed token transfers, or communication
              failures.
            </p>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Open source license</h2>
            <p className="text-[15px] leading-[1.75]">
              The source code for Airhop is published under the MIT License on{" "}
              <TextLink href={REPO_URL} tone="quiet">
                GitHub
              </TextLink>
              . The MIT License governs use, modification, and distribution of the code. These terms
              of service apply to use of this website and the Airhop app, not to the source code
              itself.
            </p>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Changes to these terms</h2>
            <p className="text-[15px] leading-[1.75]">
              These terms may be updated from time to time. The date at the top of this page
              reflects the most recent revision. Continued use of the site or app after changes are
              posted means you accept the updated terms.
            </p>
          </section>

          <section className="border-line space-y-4 border-t pt-12 first:border-t-0 first:pt-0">
            <h2 className="text-ink text-base font-semibold">Contact</h2>
            <p className="text-[15px] leading-[1.75]">
              Questions about these terms can be sent to{" "}
              <TextLink href="mailto:hi@areeb.dev" tone="quiet">
                hi@areeb.dev
              </TextLink>{" "}
              or raised by opening an issue on{" "}
              <TextLink href={REPO_LINKS.issues} tone="quiet">
                GitHub
              </TextLink>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
