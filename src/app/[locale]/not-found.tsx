import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <Container className="py-24 md:py-40">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-lg text-lg text-fg-muted">{t("description")}</p>
      <div className="mt-8">
        <ButtonLink href="/" variant="secondary">
          {t("home")}
        </ButtonLink>
      </div>
    </Container>
  );
}
