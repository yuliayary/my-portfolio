"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ContactModal from "@/components/ContactModal";

export default function Header() {
  const [showName, setShowName] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Tracks the Hero's decorative mark — the last element in the Hero — so the
    // name appears as soon as that scrolls out, not at the end of the section.
    const mark = document.getElementById("hero-mark");
    if (!mark) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // bottom <= 0 distinguishes "scrolled above the viewport" from
        // "not reached yet", which also reports as not intersecting.
        setShowName(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
      },
      { threshold: 0 },
    );

    observer.observe(mark);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between bg-brand-white px-4 py-5 sm:px-6 md:px-10">
      <motion.span
        initial={false}
        animate={{ opacity: showName ? 1 : 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeInOut" }}
        aria-hidden={!showName}
        className="text-body2 font-body text-grey-light md:text-body1"
      >
        Yuliia Yaryna
      </motion.span>
      <ContactModal />
    </header>
  );
}
