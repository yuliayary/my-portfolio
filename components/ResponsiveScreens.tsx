"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

export type Shot = { src: string; alt: string; width: number; height: number };

// Gap between carousel slides (Tailwind gap-4 = 16px). Kept in sync with the
// class below so the active-dot math matches the rendered layout.
const SLIDE_GAP = 16;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Full-width product shot (desktop composite, or a single mobile screen). */
function Shot({ shot, sizes }: { shot: Shot; sizes: string }) {
  return (
    <Image
      src={shot.src}
      alt={shot.alt}
      width={shot.width}
      height={shot.height}
      sizes={sizes}
      className="h-auto w-full rounded-[24px]"
    />
  );
}

/**
 * Swipeable, scroll-snap carousel used on small screens. Each slide is ~86% wide
 * so the next screen peeks in, signalling that the row can be swiped. Dots below
 * track and control the active slide.
 */
function MobileCarousel({ shots }: { shots: Shot[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const slideStride = useCallback(() => {
    const el = scroller.current;
    const first = el?.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth + SLIDE_GAP : 1;
  }, []);

  const onScroll = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / slideStride()));
  }, [slideStride]);

  const goTo = useCallback(
    (i: number) => {
      const el = scroller.current;
      if (!el) return;
      el.scrollTo({
        left: i * slideStride(),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    },
    [slideStride],
  );

  return (
    <div>
      <div
        ref={scroller}
        onScroll={onScroll}
        role="group"
        aria-roledescription="carousel"
        aria-label="App screens — swipe to browse"
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {shots.map((shot) => (
          <div key={shot.src} className="w-[86%] shrink-0 snap-start">
            <Shot shot={shot} sizes="86vw" />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {shots.map((shot, i) => (
          <button
            key={shot.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to screen ${i + 1} of ${shots.length}`}
            aria-current={i === active}
            className={`h-2 w-2 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
              i === active ? "bg-brand-black" : "bg-grey-light/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * A results block with distinct desktop and mobile artwork. On md+ the desktop
 * composite is shown full-bleed; below md the mobile screens are shown — a
 * single screen when there's one, or a swipeable carousel when there are
 * several. Authored in markdown by tagging images with a `"desktop"` or
 * `"mobile"` title (see CaseStudyBody).
 */
export default function ResponsiveScreens({
  desktop,
  mobile,
}: {
  desktop?: Shot;
  mobile: Shot[];
}) {
  return (
    <figure className="mt-12 w-full">
      {desktop && (
        <div className="hidden md:block">
          <Shot shot={desktop} sizes="(min-width: 1280px) 1200px, 100vw" />
        </div>
      )}

      <div className={desktop ? "md:hidden" : undefined}>
        {mobile.length <= 1 ? (
          mobile[0] && <Shot shot={mobile[0]} sizes="100vw" />
        ) : (
          <MobileCarousel shots={mobile} />
        )}
      </div>
    </figure>
  );
}
