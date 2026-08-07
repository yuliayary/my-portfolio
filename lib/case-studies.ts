import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Case study copy lives in the repo as markdown-with-frontmatter (see CLAUDE.md).
// This module is the single place that reads that directory; it runs at build
// time only (Server Components / generateStaticParams), never in the browser.
const CASE_STUDIES_DIR = path.join(process.cwd(), "content", "case-studies");

export type CaseStudyMeta = {
  title: string;
  slug: string;
  company: string;
  industry: string;
  tags: string[];
  type: string;
  order: number;
  cover: string;
  /** Client logo shown next to the company name; empty to hide the row. */
  logo: string;
  /** Decorative brand mark under the header; empty to hide it. */
  mark: string;
  /**
   * When true, the `\n` in `title` only breaks on small screens; on desktop the
   * title collapses to one line. When false (default), it breaks at all sizes.
   */
  titleBreakMobileOnly: boolean;
};

export type CaseStudy = {
  meta: CaseStudyMeta;
  /** The markdown body, frontmatter stripped. */
  content: string;
};

/** Every case study slug, ordered by frontmatter `order`. */
export function getCaseStudySlugs(): string[] {
  return getAllCaseStudies().map((study) => study.meta.slug);
}

/** Load a single case study by slug, or `null` if it doesn't exist. */
export function getCaseStudy(slug: string): CaseStudy | null {
  const filePath = path.join(CASE_STUDIES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    meta: {
      title: String(data.title ?? ""),
      slug: String(data.slug ?? slug),
      company: String(data.company ?? ""),
      industry: String(data.industry ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      type: String(data.type ?? ""),
      order: Number(data.order ?? 0),
      cover: String(data.cover ?? ""),
      logo: String(data.logo ?? ""),
      mark: String(data.mark ?? ""),
      titleBreakMobileOnly: Boolean(data.titleBreakMobileOnly ?? false),
    },
    content,
  };
}

/** All case studies, ordered by frontmatter `order`. */
export function getAllCaseStudies(): CaseStudy[] {
  if (!fs.existsSync(CASE_STUDIES_DIR)) return [];

  return fs
    .readdirSync(CASE_STUDIES_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => getCaseStudy(file.replace(/\.md$/, "")))
    .filter((study): study is CaseStudy => study !== null)
    .sort((a, b) => a.meta.order - b.meta.order);
}
