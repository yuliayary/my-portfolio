import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import CaseStudyBody, { RESULT_ANCHOR } from "@/components/CaseStudyBody";
import Container from "@/components/ui/Container";
import { getCaseStudy, getCaseStudySlugs } from "@/lib/case-studies";

// Pre-render every case study at build time.
export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

// In this Next version `params` is a Promise and must be awaited (see AGENTS.md).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  // The title carries an authored line break for display; flatten it for <title>.
  const flatTitle = study.meta.title.replace(/\s*\n\s*/g, " ");

  return {
    title: `${flatTitle} — Yuliia Yaryna`,
    description: study.meta.company
      ? `${study.meta.type} for ${study.meta.company}.`
      : study.meta.type,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const { meta, content } = study;

  return (
    <>
      {/* Case studies have no Hero, so the name is shown persistently. */}
      <Header alwaysShowName />
      <main className="flex-1">
        <Container>
          <article className="pb-16 md:pb-24">
            <div className="pt-6">
            <a
              href="/#work"
              className="inline-flex items-center gap-2 font-body text-body2 text-grey-dark transition-colors hover:text-brand-black"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/arrow_back.svg" alt="" width={20} height={20} className="shrink-0" />
              Back to all projects
            </a>
          </div>

          <header className="flex flex-col items-center pt-16 text-center md:pt-24">
            {/* The title carries an authored line break (see frontmatter). */}
            <h1 className="font-heading text-h2 whitespace-pre-line text-brand-black md:text-h1">
              {meta.title}
            </h1>

            <div className="mt-6 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/shadows_logo.svg"
                alt=""
                width={20}
                height={20}
                className="h-5 w-5 shrink-0 object-contain"
              />
              <span className="font-body text-body2 text-brand-black md:text-body1">
                {meta.company}
              </span>
            </div>

            {/* Decorative brand marks (three blue pixel glyphs), sized to match
                the Hero's bullet glyphs on the home page (h-5). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/shadows_icon.svg"
              alt=""
              width={140}
              height={48}
              className="mt-6 h-5 w-auto"
              aria-hidden="true"
            />

            {/* The gap above this button and the gap below it (to the body) are
                kept equal. */}
            <a
              href={`#${RESULT_ANCHOR}`}
              className="mt-12 inline-flex items-center rounded-full border border-brand-black px-6 py-3 font-heading text-h4 text-brand-black transition-colors hover:bg-brand-black hover:text-brand-white md:mt-16"
            >
              Jump to result
            </a>
          </header>

          {/* first-child:mt-0 drops the intro paragraph's own top margin so this
              wrapper alone controls the button-to-text gap (matching the gap above
              the button). */}
          <div className="mt-12 [&>*:first-child]:mt-0 md:mt-16">
            <CaseStudyBody content={content} />
          </div>
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
