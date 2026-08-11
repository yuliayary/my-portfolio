import Image from "next/image";
import Container from "@/components/ui/Container";

// TODO: replace with case studies read from content/case-studies/*.md frontmatter.
const CASE_STUDIES = [
  {
    slug: "shadows-project",
    title: "Designing a website about Ukrainian decolonization",
    type: "Website design",
    // Two-state cover for the "turn the light on" moment: lights-off by
    // default (desktop), crossfading to lights-on on hover. Mobile has no
    // hover, so it shows the lit state (imageHover) by default.
    image: "/case-studies/shadows/thumbnail1.png",
    imageHover: "/case-studies/shadows/thumbnail2.png",
  },
  {
    slug: "parking-app",
    title: "Designing a parking app",
    type: "App design",
    image: "/case-studies/parking/cover.png",
  },
];

export default function WorkGrid() {
  return (
    <section id="work" className="scroll-mt-24 pt-8 pb-16 md:pt-12 md:pb-24">
      <Container>
        <h2 className="font-heading text-h3 text-brand-black md:text-h2">My work</h2>

        <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 md:mt-12 md:grid-cols-2">
          {CASE_STUDIES.map((study) => (
            <li key={study.slug}>
              <a href={`/work/${study.slug}`} className="group block">
                {study.imageHover ? (
                  // Two-state cover: lights-off by default, crossfading to
                  // lights-on on hover (the "turn the light on" moment) while
                  // both layers zoom together. Zoom is skipped for reduced
                  // motion; the crossfade (a plain fade) still plays. On mobile
                  // there's no hover, so the off layer is hidden and the lit
                  // layer shows by default.
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-[24px]">
                    <div className="relative h-full w-full transition-transform duration-500 ease-out motion-safe:group-hover:scale-105">
                      <Image
                        src={study.image}
                        alt={study.title}
                        width={0}
                        height={0}
                        sizes="(min-width: 768px) 590px, 100vw"
                        className="absolute inset-0 hidden h-full w-full object-cover transition-opacity duration-500 ease-out md:block md:group-hover:opacity-0"
                      />
                      <Image
                        src={study.imageHover}
                        alt=""
                        aria-hidden
                        width={0}
                        height={0}
                        sizes="(min-width: 768px) 590px, 100vw"
                        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out md:opacity-0 md:group-hover:opacity-100"
                      />
                    </div>
                  </div>
                ) : study.image ? (
                  // Simple zoom-in on hover; clipped by the rounded container and
                  // skipped for users who prefer reduced motion.
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-[24px]">
                    <Image
                      src={study.image}
                      alt={study.title}
                      width={0}
                      height={0}
                      sizes="(min-width: 768px) 590px, 100vw"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-105"
                    />
                  </div>
                ) : (
                  // TODO: replace with the case study cover image
                  <div
                    className="aspect-[4/3] w-full rounded-[24px] border border-brand-black bg-grey-light"
                    role="img"
                    aria-label={`Placeholder cover image for ${study.title}`}
                  />
                )}
                <h3 className="mt-4 font-heading text-h4 text-brand-black md:text-h3">{study.title}</h3>
                <p className="mt-2 font-body text-body2 text-grey-light">{study.type}</p>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
