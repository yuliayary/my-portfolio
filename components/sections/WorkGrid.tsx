// TODO: replace with case studies read from content/case-studies/*.md frontmatter.
// TODO: decide the card "lighting up" hover effect once real artwork is in.
const CASE_STUDIES = [
  { slug: "project-one", title: "Shadows project: Ukrainian decolonization", type: "Website design" },
  { slug: "project-two", title: "Shadows project: Ukrainian decolonization", type: "Website design" },
  { slug: "project-three", title: "Shadows project: Ukrainian decolonization", type: "Website design" },
  { slug: "project-four", title: "Shadows project: Ukrainian decolonization", type: "Website design" },
];

export default function WorkGrid() {
  return (
    <section className="px-4 pt-8 pb-16 sm:px-6 md:px-10 md:pt-12 md:pb-24">
      <h2 className="font-heading text-h3 text-brand-black md:text-h2">My work</h2>

      <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 md:mt-12 md:grid-cols-2">
        {CASE_STUDIES.map((study) => (
          <li key={study.slug}>
            <a href={`/work/${study.slug}`} className="block">
              {/* TODO: replace with the case study cover image */}
              <div
                className="aspect-[4/3] w-full rounded-[24px] border border-brand-black bg-grey-light"
                role="img"
                aria-label={`Placeholder cover image for ${study.title}`}
              />
              <h3 className="mt-4 font-heading text-h4 text-brand-black md:text-h3">{study.title}</h3>
              <p className="mt-2 font-body text-body2 text-grey-light">{study.type}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
