import { getTranslations } from "next-intl/server";
import { contactLinks } from "@/lib/links";
import { site } from "@/config/site";
import { Container } from "./container";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tContact = await getTranslations("contact");
  const links = contactLinks().filter((link) => link.href);

  return (
    <footer className="border-t border-border py-10 text-sm">
      <Container className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="font-semibold text-fg">{site.name}</p>
          <p className="max-w-sm text-fg-muted">{t("tagline")}</p>
        </div>
        <div className="space-y-3 md:text-right">
          {links.length > 0 ? (
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-fg-muted md:justify-end">
              {links.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href!}
                    className="transition-colors hover:text-fg"
                    {...(link.key === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    {tContact(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="font-mono text-xs text-fg-subtle">
            {t("rights", { year: new Date().getFullYear() })} · {t("source")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
