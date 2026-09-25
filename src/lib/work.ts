import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

import type { Locale } from "@/i18n/routing";

/**
 * Case studies live in /content/{locale}/work/{slug}.mdx.
 * The slug is the file name and must be identical across locales.
 */
const CONTENT_DIR = path.join(process.cwd(), "content");

export type WorkStatus = "production" | "in-development";

export type WorkMeta = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  /** Path to an image in /public. Empty until screenshots exist. */
  cover: string;
  order: number;
  status: WorkStatus;
  /** Client name, or "internal" for internal tools. */
  client: string;
  year: string;
  role?: string;
  /** Short left-to-right flow shown on the home card when there is no cover. */
  flow: string[];
};

export type WorkEntry = {
  meta: WorkMeta;
  body: string;
};

function workDir(locale: Locale) {
  return path.join(CONTENT_DIR, locale, "work");
}

export const getWorkSlugs = cache(async (locale: Locale): Promise<string[]> => {
  const files = await fs.readdir(workDir(locale));
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
});

export const getWork = cache(
  async (locale: Locale, slug: string): Promise<WorkEntry | null> => {
    if (!/^[a-z0-9-]+$/.test(slug)) return null;
    const file = path.join(workDir(locale), `${slug}.mdx`);

    let raw: string;
    try {
      raw = await fs.readFile(file, "utf8");
    } catch {
      return null;
    }

    const { data, content } = matter(raw);
    return { meta: parseFrontmatter(data, slug, file), body: content };
  },
);

export const getAllWork = cache(async (locale: Locale): Promise<WorkMeta[]> => {
  const slugs = await getWorkSlugs(locale);
  const entries = await Promise.all(slugs.map((slug) => getWork(locale, slug)));
  return entries
    .filter((entry): entry is WorkEntry => entry !== null)
    .map((entry) => entry.meta)
    .sort((a, b) => a.order - b.order);
});

/**
 * Validates frontmatter so a typo in an MDX file fails the build with a clear
 * message instead of rendering a broken page.
 */
function parseFrontmatter(
  data: Record<string, unknown>,
  slug: string,
  file: string,
): WorkMeta {
  const fail = (field: string, expected: string): never => {
    throw new Error(
      `Invalid frontmatter in ${path.relative(process.cwd(), file)}: "${field}" must be ${expected}.`,
    );
  };

  const str = (field: string, optional = false): string => {
    const value = data[field];
    if (value === undefined || value === null) {
      return optional ? "" : fail(field, "a string");
    }
    if (typeof value === "string" || typeof value === "number") return String(value);
    return fail(field, "a string");
  };

  const list = (field: string): string[] => {
    const value = data[field] ?? [];
    if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
      fail(field, "a list of strings");
    }
    return value as string[];
  };

  const status = str("status");
  if (status !== "production" && status !== "in-development") {
    fail("status", '"production" or "in-development"');
  }

  const order = Number(data.order);
  if (!Number.isFinite(order)) fail("order", "a number");

  return {
    slug,
    title: str("title"),
    summary: str("summary"),
    tags: list("tags"),
    cover: str("cover", true),
    order,
    status: status as WorkStatus,
    client: str("client"),
    year: str("year"),
    role: str("role", true) || undefined,
    flow: list("flow"),
  };
}
