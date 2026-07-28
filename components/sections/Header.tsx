"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ContactModal from "@/components/ContactModal";

export default function Header() {
  const [showName, setShowName] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Tracks the Hero headline so the name appears the moment its last line
    // slips behind the sticky header. rootMargin pulls the observer's top edge
    // down by the header's height — without it the trigger waits until the
    // headline reaches the viewport top, ~one header-height too late.
    const mark = document.getElementById("hero-headline");
    const header = document.querySelector("header");
    if (!mark || !header) return;

    const headerHeight = header.offsetHeight;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // bottom <= headerHeight distinguishes "scrolled up behind the header"
        // from "not reached yet", which also reports as not intersecting.
        setShowName(
          !entry.isIntersecting && entry.boundingClientRect.bottom <= headerHeight,
        );
      },
      { threshold: 0, rootMargin: `-${headerHeight}px 0px 0px 0px` },
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
