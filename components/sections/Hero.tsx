import Container from "@/components/ui/Container";

const SUB_ITEMS = ["Berlin-based, Kyiv-raised", "6+ years in UX"];

export default function Hero() {
  // Spacing is explicit rather than viewport-driven: min-h-screen would force a
  // fixed amount of leftover space below the content, which sets the gap to WorkGrid.
  return (
    <section id="hero" className="pt-[100px] pb-[88px] md:pt-[140px] md:pb-[112px]">
      <Container className="flex flex-col">
        {/* Type steps down to H3 on mobile. Base colour is grey; black spans mark
            the emphasised phrases. Forced breaks match the Figma frame — the colour
            segments deliberately cross the line boundaries. Mobile adds one extra
            break (after the name) so the wider first line splits into two. */}
        <h1 id="hero-headline" className="font-heading text-h3 text-grey-light md:text-h1">
        I&apos;m Yuliia Yaryna, <br className="md:hidden" />
        <span className="text-brand-black">a UX researcher</span>
        <br />
        becoming <span className="text-brand-black">a UX designer</span>
        <br />
        (yes, again).
      </h1>

        <ul className="mt-8 flex flex-col gap-2 md:mt-12">
          {SUB_ITEMS.map((item) => (
            <li key={item} className="flex items-center gap-2 font-body text-body2 text-brand-black md:text-body1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hero_icon.svg" alt="" width={22} height={24} className="h-5 w-auto shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
