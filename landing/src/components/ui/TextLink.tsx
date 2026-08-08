import { Link } from "react-router-dom";

const TONES = {
  strong: "text-ink hover:text-secondary",
  quiet: "hover:text-ink",
} as const;

export default function TextLink({
  href,
  tone = "strong",
  children,
}: {
  href: string;
  tone?: keyof typeof TONES;
  children: React.ReactNode;
}) {
  const className = `${TONES[tone]} underline underline-offset-2 transition-colors duration-150`;

  if (href.startsWith("/")) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={className}
    >
      {children}
    </a>
  );
}
