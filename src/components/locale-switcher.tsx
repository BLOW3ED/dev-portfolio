"use client";

import { usePathname } from "next/navigation";

type LocaleOption = { code: string; label: string; prefix: string };

/**
 * Links to the current page in every locale. Plain <a> so the full
 * navigation also refreshes <html lang>; no i18n runtime in the browser.
 */
export function LocaleSwitcher({
  current,
  locales,
  label,
}: {
  current: string;
  locales: LocaleOption[];
  label: string;
}) {
  const pathname = usePathname() ?? "/";
  const codes = locales.map((locale) => locale.code).join("|");
  const rest = pathname.replace(new RegExp(`^/(${codes})(?=/|$)`), "") || "/";

  return (
    <nav aria-label={label}>
      <ul className="flex items-center rounded-md border border-border p-0.5 font-mono text-xs">
        {locales.map((locale) => {
          const active = locale.code === current;
          const href = locale.prefix
            ? `${locale.prefix}${rest === "/" ? "" : rest}`
            : rest;
          return (
            <li key={locale.code}>
              <a
                href={href}
                hrefLang={locale.code}
                lang={locale.code}
                aria-current={active ? "true" : undefined}
                aria-label={locale.label}
                className={`block rounded px-2 py-1 uppercase transition-colors ${
                  active ? "bg-bg-elev text-fg" : "text-fg-muted hover:text-fg"
                }`}
              >
                {locale.code}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
