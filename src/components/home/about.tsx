import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { isPlaceholder, isTodo, site } from "@/config/site";
import { Section } from "../section";
import { withTodos } from "../todo";

export async function About() {
  const t = await getTranslations("about");
  const bio = t.raw("bio") as string[];
  const hasPhoto = !isTodo(site.photo);
  // An empty photo means "none": the bio takes the full width.
  const showPhoto = hasPhoto || isPlaceholder(site.photo);

  return (
    <Section id="about" index="04" eyebrow={t("eyebrow")}>
      <div
        className={`grid grid-cols-1 gap-8 md:gap-12 ${showPhoto ? "md:grid-cols-[220px_1fr]" : ""}`}
      >
        {showPhoto ? (
          <div className="relative aspect-square w-40 overflow-hidden rounded-xl border border-border bg-bg-elev md:w-full">
            {hasPhoto ? (
              <Image
                src={site.photo}
                alt={t("photoAlt")}
                fill
                sizes="(min-width: 768px) 220px, 160px"
                className="object-cover"
              />
            ) : (
              <div className="bg-schematic grid h-full place-items-center p-4 text-center text-xs">
                {withTodos(site.photo)}
              </div>
            )}
          </div>
        ) : null}
        <div className="max-w-prose space-y-4">
          <h3 className="text-2xl font-semibold tracking-tight text-fg md:text-3xl">
            {t("title")}
          </h3>
          {bio.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-relaxed text-fg-muted">
              {withTodos(paragraph)}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
