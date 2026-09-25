import { getTranslations } from "next-intl/server";
import { isTodo } from "@/config/site";
import { ArrowIcon } from "../button-link";
import { Container } from "../container";
import { Eyebrow } from "../section";
import { TagList } from "../tag";
import { withTodos } from "../todo";

type Project = { title: string; description: string; tags: string[]; href: string };

export async function MoreProjects() {
  const t = await getTranslations("moreProjects");
  const items = t.raw("items") as Project[];

  return (
    <section aria-labelledby="more-projects-label" className="pb-16 md:pb-section">
      <Container>
        <Eyebrow as="h2" id="more-projects-label">
          {t("eyebrow")}
        </Eyebrow>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((project) => {
            const link = project.href && !isTodo(project.href) ? project.href : null;
            return (
              <li
                key={project.title}
                className="flex flex-col gap-3 rounded-lg border border-border p-5"
              >
                <h3 className="font-semibold text-fg">{project.title}</h3>
                <p className="text-sm text-fg-muted">{project.description}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
                  <TagList tags={project.tags} />
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-fg hover:text-accent"
                    >
                      {t("externalLink")}
                      <span className="sr-only"> {project.title}</span>
                      <ArrowIcon direction="up-right" />
                    </a>
                  ) : project.href ? (
                    <p className="text-xs">{withTodos(project.href)}</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
