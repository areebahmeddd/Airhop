import { useLanguage, useT } from "@/i18n";
import { Info } from "lucide-react";

export default function EnglishContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const T = useT();
  const translated = useLanguage() === "en";

  return (
    <>
      {translated ? null : (
        <p className="border-line bg-card-subtle text-mute mt-8 flex items-center gap-2 rounded-2xl border px-4 py-3 text-[13px]">
          <Info size={14} className="shrink-0" aria-hidden="true" />
          {T("page.english_only")}
        </p>
      )}
      <div lang="en" dir="ltr" className={className}>
        {children}
      </div>
    </>
  );
}
