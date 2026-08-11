"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const LINKEDIN_URL = "https://www.linkedin.com/in/yulia-yaryna/";
const CV_URL = "/CV_Yuliia_Yaryna_UX_designer.pdf";
const CONTACT_EMAIL = "yulia.yaryna@gmail.com";

function ContactLinks({ onEmailCopy, copied }: { onEmailCopy: () => void; copied: boolean }) {
  return (
    <>
      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 whitespace-nowrap text-body2 font-body text-brand-black"
      >
        LinkedIn
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/arrow-outward.svg" alt="" width={16} height={16} className="shrink-0" />
      </a>
      <button
        type="button"
        onClick={onEmailCopy}
        className="flex items-center gap-1 whitespace-nowrap text-body2 font-body text-brand-black"
      >
        {copied ? "Copied!" : CONTACT_EMAIL}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/content-copy.svg" alt="" width={16} height={16} className="shrink-0" />
      </button>
      <a
        href={CV_URL}
        download
        className="flex items-center gap-1 whitespace-nowrap text-body2 font-body text-brand-black"
      >
        CV
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/arrow-downward.svg" alt="" width={16} height={16} className="shrink-0" />
      </a>
    </>
  );
}

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — no-op.
    }
  };

  // The box eases open; its contents fade slightly behind it so text doesn't
  // appear before there's room for it.
  const boxTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };
  const fadeTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: "easeOut" as const, delay: isOpen ? 0.12 : 0 };

  return (
    // Mobile reserves the collapsed button's height (48px + 1px borders) so the
    // panel can overlay the page on open rather than growing the sticky header.
    <div ref={containerRef} className="relative h-[50px] md:h-auto">
      {/* `layout` animates the box's width and height together — the panel is
          wider than the collapsed button, so animating height alone left the
          width snapping instantly. borderRadius is set inline so Framer can
          correct it during the layout transform instead of stretching it. */}
      <motion.div
        layout
        transition={boxTransition}
        style={{ borderRadius: 24 }}
        // w-max is load-bearing on mobile: the wrapper this is anchored to has
        // zero width, so `right-0` with an auto width resolves via shrink-to-fit
        // against zero available space. Engines disagree on the result, and a
        // too-narrow box lets the label overflow into the right padding, where
        // overflow-hidden clips it. max-content sizes to the contents instead.
        className="absolute top-0 right-0 flex w-max flex-col overflow-hidden border border-brand-black bg-brand-white md:static md:w-auto md:flex-row md:items-center"
      >
        <motion.button
          layout="position"
          transition={boxTransition}
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          className="flex items-center gap-2 whitespace-nowrap px-5 py-3 text-h4 font-heading text-brand-black md:text-h3"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/contact-me.svg" alt="" width={16} height={16} className="shrink-0" />
          Contact me
        </motion.button>

        {/* Desktop: unfolds to the left, inline with the button. Size is handled
            by the parent's layout animation; these only fade. */}
        {/* popLayout takes the exiting child out of flow immediately, so the box
            shrinks at the same time as the fade. Without it the collapse runs in
            sequence — fade first, then resize — which reads as a stutter. */}
        <AnimatePresence initial={false} mode="popLayout">
          {isOpen && (
            <motion.div
              key="inline-links"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
              className="hidden items-center gap-6 pr-5 whitespace-nowrap md:flex"
            >
              <ContactLinks onEmailCopy={handleCopyEmail} copied={copied} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile: unfolds downward inside the same outline. */}
        {/* popLayout takes the exiting child out of flow immediately, so the box
            shrinks at the same time as the fade. Without it the collapse runs in
            sequence — fade first, then resize — which reads as a stutter. */}
        <AnimatePresence initial={false} mode="popLayout">
          {isOpen && (
            <motion.div
              key="stacked-links"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
              className="md:hidden"
            >
              {/* pl matches the button's px-5 + 16px icon + gap-2, so the links
                  share a left edge with the "Contact me" label. */}
              <div className="flex flex-col items-start gap-6 pt-2 pr-5 pb-5 pl-[44px]">
                <ContactLinks onEmailCopy={handleCopyEmail} copied={copied} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
