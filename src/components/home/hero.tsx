import { getTranslations } from "next-intl/server";
import { primaryCta } from "@/lib/links";
import { ArrowIcon, ButtonLink } from "../button-link";
import { Container } from "../container";

export async function Hero() {
  const [t, tCta] = await Promise.all([getTranslations("hero"), getTranslations("cta")]);
  const cta = primaryCta();

  return (
    <section aria-labelledby="hero-title" className="pt-16 pb-12 md:pt-28 md:pb-20">
      <Container>
        <p className="flex items-center gap-2.5 font-mono text-sm text-fg-muted">
          <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
          {t("name")}
        </p>
        <h1
          id="hero-title"
          className="mt-6 max-w-4xl text-display font-semibold text-fg text-balance md:text-6xl md:leading-[1.05] lg:text-7xl"
        >
          {t("headline")}
        </h1>
        <p className="mt-6 max-w-2xl font-mono text-sm leading-relaxed text-fg-muted md:text-[15px]">
          {t("subline")}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={cta.href} external={cta.external}>
            {cta.kind === "email" ? tCta("emailMe") : t("primaryCta")}
            <ArrowIcon direction={cta.external ? "up-right" : "right"} />
          </ButtonLink>
          <ButtonLink href="#work" variant="secondary">
            {t("secondaryCta")}
            <ArrowIcon direction="down" />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
