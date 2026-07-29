import type { ReactNode } from "react";

// The shared layout shell. Everything on the site aligns to this centered,
// max-width band and its horizontal padding — the header, the home sections,
// and the case study pages all use it, so their left/right edges line up at
// every screen width and content stops widening on large monitors.
const MAX_WIDTH = "max-w-[1280px]";

export default function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full ${MAX_WIDTH} px-4 sm:px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}
