"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ContactModal from "@/components/ContactModal";

export default function Header() {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // TODO: swap for an IntersectionObserver on the Hero section's end once
    // Hero is built, so this tracks the actual section boundary instead of
    // an assumed one-viewport-height threshold.
    const threshold = window.innerHeight * 0.8;

    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between bg-brand-white px-6 py-5 md:px-10">
      <motion.span
        initial={false}
        animate={{ opacity: scrolledPastHero ? 1 : 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeInOut" }}
        aria-hidden={!scrolledPastHero}
        className="text-body2 font-body text-grey-light md:text-body1"
      >
        Yuliia Yaryna
      </motion.span>
      <ContactModal />
    </header>
  );
}
