import { Link } from "react-router-dom";

const NAV_COLUMNS = [
  {
    heading: "Download",
    links: [
      { label: "App Store", href: "https://apps.apple.com/app/airhop/id000000000", external: true },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=org.onemindlabs.airhop",
        external: true,
      },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Source Code", href: "https://github.com/areebahmeddd/Airhop", external: true },
      { label: "FAQ", href: "/faq", external: false },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy", external: false },
      { label: "Terms of Service", href: "/terms-of-service", external: false },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-white px-6 py-12 md:px-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Main grid: brand + nav columns */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 space-y-3 sm:col-span-2 md:col-span-1">
            <Link
              to="/"
              className="inline-block text-xl font-black tracking-tighter text-black select-none"
              aria-label="Airhop home"
            >
              AIRHOP
            </Link>
            <p className="font-mono text-xs leading-relaxed text-gray-400 select-none">
              Offline peer-to-peer messaging
              <br />
              over Bluetooth mesh.
            </p>
            <p className="font-mono text-[10px] text-gray-300 select-none">
              No internet. No servers. No accounts.
            </p>
          </div>

          {/* Nav columns */}
          {NAV_COLUMNS.map((col) => (
            <div key={col.heading} className="space-y-3">
              <p className="font-mono text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-gray-500 transition-colors hover:text-black"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="font-mono text-xs text-gray-500 transition-colors hover:text-black"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-gray-100 pt-6">
          <p className="font-mono text-[10px] text-gray-400 select-none">
            &copy; {currentYear} Areeb Ahmed. Released under MIT.
          </p>
        </div>
      </div>
    </footer>
  );
}
