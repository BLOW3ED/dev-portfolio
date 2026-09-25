import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/components/link";
import { bookingLink } from "@/lib/links";
import { site } from "@/config/site";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { ButtonLink } from "./button-link";
import { Container } from "./container";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

const NAV = ["work", "services", "process", "about", "contact"] as const;

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const tMeta = await getTranslations("meta");
  const booking = bookingLink();
  const locale = await getLocale();
  const locales = routing.locales.map((code) => ({
    code,
    label: t(`localeNames.${code}`),
    prefix: getPathname({ locale: code, href: "/" }).replace(/\/$/, ""),
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-3">
        <Link
          href="/"
          aria-label={t("home")}
          className="flex items-baseline gap-2 text-[15px] font-semibold tracking-tight text-fg"
        >
          {site.name}
          <span aria-hidden="true" className="hidden font-mono text-xs font-normal text-fg-subtle sm:inline">
            / {tMeta("jobTitle")}
          </span>
        </Link>

        <nav aria-label={t("primary")} className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm text-fg-muted">
            {NAV.map((item) => (
              <li key={item}>
                <Link href={`/#${item}`} className="transition-colors hover:text-fg">
                  {t(item)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher current={locale} locales={locales} label={t("language")} />
          <ThemeToggle label={t("themeToggle")} />
          <ButtonLink
            href={booking.href}
            external={booking.external}
            size="sm"
          >
            {t("bookCall")}
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
