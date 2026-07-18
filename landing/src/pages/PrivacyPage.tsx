import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: July 18, 2026</p>
        </div>

        <div className="mt-10 space-y-10 text-gray-700">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Overview</h2>
            <p className="text-sm leading-relaxed">
              airhop.1mindlabs.org is a static informational website for the Airhop open-source
              project. <strong>We do not collect personal information from visitors.</strong> This
              policy explains what data exists, where it comes from, and how it is handled.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Data we do not collect</h2>
            <p className="text-sm leading-relaxed">
              This site has no user accounts, no login, no sign-up forms, and no analytics tracking.
              We do not set cookies. We do not collect your name, email address, IP address, or any
              other identifying information just from visiting the site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Server logs</h2>
            <p className="text-sm leading-relaxed">
              Standard web server logs may record IP addresses, browser types, and page requests.
              These logs exist solely to diagnose technical issues and are not shared with third
              parties or used for any analytics purpose.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">GitHub API</h2>
            <p className="text-sm leading-relaxed">
              The site fetches the public GitHub star count for the Airhop repository from the
              GitHub API. This request is made from your browser and does not include any user data.
              It is equivalent to loading any public page on GitHub.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">The Airhop app</h2>
            <p className="text-sm leading-relaxed">
              The Airhop mobile app is designed with privacy as a foundational principle. Your
              identity is a cryptographic key pair stored locally on your device. No account
              information, message content, or metadata is transmitted to any server operated by
              this project. For a full technical description of how the app handles data, see the
              source code and documentation at{" "}
              <a
                href="https://github.com/areebahmeddd/Airhop"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-gray-900"
              >
                github.com/areebahmeddd/Airhop
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">External links</h2>
            <p className="text-sm leading-relaxed">
              This site links to external services including GitHub and app stores. Once you leave
              airhop.1mindlabs.org, this privacy policy no longer applies. We have no control over
              what those services collect.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Changes to this policy</h2>
            <p className="text-sm leading-relaxed">
              If this policy changes in a meaningful way, the updated date at the top of this page
              will reflect it. Since we collect no personal data, changes are unlikely to affect you
              in practice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Contact</h2>
            <p className="text-sm leading-relaxed">
              Questions or concerns can be sent to{" "}
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
