"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ContactModal from "@/components/ContactModal";
import Container from "@/components/ui/Container";

export default function Header({ alwaysShowName = false }: { alwaysShowName?: boolean }) {
  const [showName, setShowName] = useState(alwaysShowName);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // On pages without a Hero (e.g. case studies) the name is always shown, so
    // there's nothing to observe.
    if (alwaysShowName) return;

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
  }, [alwaysShowName]);

  return (
    // The bar (and its background) spans the full width; its contents align to
    // the shared shell so the name lines up with the page content below.
    <header className="sticky top-0 z-50 w-full bg-brand-white">
      <Container className="flex items-center justify-between py-5">
        {/* Links home. When hidden (top of the home page) it's non-interactive so
            it can't be clicked or tabbed to while invisible. */}
        <motion.a
        href="/"
        initial={false}
        animate={{ opacity: showName ? 1 : 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeInOut" }}
        aria-hidden={!showName}
        tabIndex={showName ? 0 : -1}
        className={`text-body2 font-body text-grey-light transition-colors hover:text-brand-black md:text-body1 ${
          showName ? "" : "pointer-events-none"
        }`}
      >
          Yuliia Yaryna
        </motion.a>
        <ContactModal />
      </Container>
    </header>
  );
}
