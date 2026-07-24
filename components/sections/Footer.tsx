import Image from "next/image";

export default function Footer() {
  return (
    // Holds the frame's 10:3 proportion, floored on narrow screens and capped at
    // the 1440px design height so it doesn't balloon on wide monitors.
    // w-full is load-bearing: below 667px the min-height wins, and without a
    // definite width Safari resolves the width from the ratio instead (200 x 10/3
    // = 667px), overflowing the viewport. Pinning it keeps the ratio height-only.
    // Content above lands the footer on a fractional y, so its top and bottom edges
    // each fall mid-device-pixel and blend with the page background. The gradient
    // mirrors the sky image's own range (#f4f6fa at top, matching the page, to
    // #6e8fc1 at bottom) so both seams composite invisibly; the shadow extends that
    // bottom tone past the final row.
    <footer className="relative flex w-full max-w-full aspect-[10/3] max-h-[432px] min-h-[200px] items-end overflow-hidden bg-[linear-gradient(to_bottom,#f4f6fa,#6e8fc1)] px-4 pb-8 shadow-[0_2px_0_0_#6e8fc1] sm:px-6 md:px-10 md:pb-12">
      <Image src="/footer-sky.jpg" alt="" fill sizes="100vw" className="object-cover" />
      <p className="relative flex items-center gap-2 font-body text-body2 text-brand-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/contact_me.svg" alt="" width={24} height={24} className="shrink-0" />
        {/* Wrapped in a span so the <br> stays in normal flow rather than
            becoming a flex item, which would stop it breaking the line. */}
        <span>
          Designed and vibe-coded by Yuliia Yaryna.{" "}
          <br className="md:hidden" />
          Berlin, 2026
        </span>
      </p>
    </footer>
  );
}
