import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";

export default function TermsPage() {
  useSEO({
    title: "Terms of Service - Airhop",
    description: "Terms governing use of the Airhop app and website.",
    path: "/terms-of-service",
  });

  return (
    <main id="main-content" className="min-h-screen bg-white font-sans antialiased">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link
          to="/"
          className="group inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <ArrowLeft
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to home
        </Link>

        <div className="mt-10">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Terms of Service</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: September 01, 2026</p>
        </div>

        <div className="mt-10 space-y-10 text-gray-700">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">About Airhop</h2>
            <p className="text-sm leading-relaxed">
              Airhop is a free, open-source mobile application for offline peer-to-peer
              communication over Bluetooth mesh networks, built on the foundation of{" "}
              <a
                href="https://bitchat.free"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-gray-900"
              >
                bitchat
              </a>
              . It is an independent project, not backed by any company. By using this website or
              the Airhop app, you agree to these terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Acceptable use</h2>
            <p className="text-sm leading-relaxed">
              You may use Airhop for lawful purposes only. You are responsible for complying with
              the laws of your jurisdiction, including any regulations governing encrypted
              communications, radio frequency use, and peer-to-peer networks. Do not use Airhop to
              facilitate illegal activity or to harm others.
            </p>
            <p className="text-sm leading-relaxed">
              This website is for informational purposes. Do not use automated tools to
              bulk-download or scrape content from it.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Content you post</h2>
            <p className="text-sm leading-relaxed">
              Public channels, location channels, and bulletin-board notices are visible to anyone
              in range or in the same area, including people using other compatible apps. Treat
              anything posted there as public. You are responsible for what you post.
            </p>
            <p className="text-sm leading-relaxed">
              <strong>
                There is no central server, so we cannot moderate, edit, or delete what you or
                anyone else sends.
              </strong>{" "}
              Deleting your own notice broadcasts a signed retraction that other devices honour, and
              notices expire on their own, but a copy that has already reached another device may
              remain there.
            </p>
            <p className="text-sm leading-relaxed">
              If you turn on the internet gateway, your device relays other people&apos;s public
              location-channel messages. You do not author that content and cannot control it.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Offline payments</h2>
            <p className="text-sm leading-relaxed">
              Airhop supports transferring Cashu ecash tokens directly between devices over the
              mesh.{" "}
              <strong>
                We do not operate any payment infrastructure. We are not a financial institution,
                payment processor, or money services business.
              </strong>{" "}
              Token transfers occur between devices without any involvement from this project. We
              have no ability to reverse, recover, or mediate any transaction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">No warranty</h2>
            <p className="text-sm leading-relaxed">
              Airhop is provided &quot;as is&quot; without any warranty of any kind. We make no
              guarantees about reliability, availability, or fitness for a particular purpose.
            </p>
            <p className="text-sm leading-relaxed">
              The app has not been formally security-audited by an external firm. An audit is
              planned but has not been completed.{" "}
              <strong>
                Do not rely on Airhop as your only means of communication in life-safety situations.
              </strong>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Limitation of liability</h2>
            <p className="text-sm leading-relaxed">
              To the fullest extent permitted by applicable law, we are not liable for any direct,
              indirect, incidental, or consequential damages arising from your use of this website
              or the Airhop app, including loss of data, failed token transfers, or communication
              failures.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Open source license</h2>
            <p className="text-sm leading-relaxed">
              The source code for Airhop is published under the MIT License on{" "}
              <a
                href="https://github.com/areebahmeddd/Airhop"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-gray-900"
              >
                GitHub
              </a>
              . The MIT License governs use, modification, and distribution of the code. These terms
              of service apply to use of this website and the Airhop app, not to the source code
              itself.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Changes to these terms</h2>
            <p className="text-sm leading-relaxed">
              These terms may be updated from time to time. The date at the top of this page
              reflects the most recent revision. Continued use of the site or app after changes are
              posted means you accept the updated terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Contact</h2>
            <p className="text-sm leading-relaxed">
              Questions about these terms can be sent to{" "}
              <a
                href="mailto:hi@areeb.dev"
                className="underline underline-offset-2 transition-colors hover:text-gray-900"
              >
                hi@areeb.dev
              </a>{" "}
              or raised by opening an issue on{" "}
              <a
                href="https://github.com/areebahmeddd/Airhop/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-gray-900"
              >
                GitHub
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
