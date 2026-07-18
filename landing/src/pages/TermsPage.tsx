import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white font-sans antialiased">
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
          <p className="mt-2 text-sm text-gray-500">Last updated: July 18, 2026</p>
        </div>

        <div className="mt-10 space-y-10 text-gray-700">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Overview</h2>
            <p className="text-sm leading-relaxed">
              Airhop is a free, open-source mobile app for offline peer-to-peer messaging over
              Bluetooth mesh. By using this site or the app, you agree to these terms. If you do not
              agree, please do not use them.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Use of the site</h2>
            <p className="text-sm leading-relaxed">
              airhop.1mindlabs.org is provided for informational purposes. You may not use automated
              tools to scrape or bulk-download content from this site. You may not use it for any
              unlawful purpose or in a way that could harm the project or its users.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Use of the app</h2>
            <p className="text-sm leading-relaxed">
              Airhop is provided as a communication tool for lawful purposes. You are responsible
              for complying with the laws of your jurisdiction, including any regulations governing
              encrypted communications, radio frequency use, and peer-to-peer networks. Do not use
              Airhop to facilitate illegal activity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">No warranty</h2>
            <p className="text-sm leading-relaxed">
              Airhop is provided &quot;as is&quot; without any warranty of any kind. We make no
              guarantees about reliability, security, or fitness for a particular purpose.{" "}
              <strong>
                Do not rely on Airhop as your sole means of communication in life-safety situations.
              </strong>{" "}
              The app has not been formally security-audited. An external audit is planned but has
              not been completed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Offline payments</h2>
            <p className="text-sm leading-relaxed">
              Airhop supports transferring ecash tokens over the mesh. We do not operate any payment
              infrastructure. We are not a financial institution, payment processor, or money
              services business. Token transfers occur directly between devices. We have no ability
              to reverse, recover, or mediate any transaction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Limitation of liability</h2>
            <p className="text-sm leading-relaxed">
              To the fullest extent permitted by law, we are not liable for any direct, indirect,
              incidental, or consequential damages arising from your use of this site or the Airhop
              app, including but not limited to loss of data or failed token transfers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Open source</h2>
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
              of service apply only to use of the hosted website at airhop.1mindlabs.org.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Changes to these terms</h2>
            <p className="text-sm leading-relaxed">
              We may update these terms from time to time. The date at the top of this page reflects
              the most recent revision. Continued use of the site after changes are posted means you
              accept the updated terms.
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
