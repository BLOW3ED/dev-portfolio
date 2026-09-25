import { getTranslations } from "next-intl/server";
import { site } from "@/config/site";
import { bookingLink, contactLinks } from "@/lib/links";
import { ArrowIcon, ButtonLink } from "../button-link";
import { Section } from "../section";
import { withTodos } from "../todo";

export async function Contact() {
  const t = await getTranslations("contact");
  const booking = bookingLink();

  return (
    <Section id="contact" index="05" eyebrow={t("eyebrow")}>
      <div className="grid grid-cols-1 gap-10 rounded-2xl border border-border bg-bg-elev p-6 md:grid-cols-[1.4fr_1fr] md:p-10">
        <div className="space-y-5">
          <h3 className="text-3xl font-semibold tracking-tight text-fg text-balance md:text-4xl">
            {t("title")}
          </h3>
          <p className="max-w-xl text-lg text-fg-muted">{t("description")}</p>
          <div className="pt-2">
            {booking.pending ? (
              <p className="text-sm">{withTodos(site.links.booking)}</p>
            ) : (
              <ButtonLink href={booking.href} external>
                {t("bookCall")}
                <ArrowIcon direction="up-right" />
              </ButtonLink>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6">
          <dl className="divide-y divide-border border-y border-border">
            {contactLinks().map((link) => (
              <div key={link.key} className="flex items-center justify-between gap-4 py-3">
                <dt className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
                  {t(link.key)}
                </dt>
                <dd className="min-w-0 truncate text-right text-sm">
                  {link.href ? (
                    <a
                      href={link.href}
                      className="text-fg underline decoration-border-strong underline-offset-4 hover:decoration-accent"
                      {...(link.key === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                    >
                      {link.display}
                    </a>
                  ) : (
                    withTodos(link.value)
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="font-mono text-xs text-fg-subtle">{t("timezone")}</p>
        </div>
      </div>
    </Section>
  );
}
