"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// TODO: replace with real LinkedIn URL and CV file once provided
const LINKEDIN_URL = "#";
const CV_URL = "#";
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
        <img src="/arrow_outward.svg" alt="" width={16} height={16} className="shrink-0" />
      </a>
      <button
        type="button"
        onClick={onEmailCopy}
        className="flex items-center gap-1 whitespace-nowrap text-body2 font-body text-brand-black"
      >
        {copied ? "Copied!" : CONTACT_EMAIL}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/content_copy.svg" alt="" width={16} height={16} className="shrink-0" />
      </button>
      <a
        href={CV_URL}
        download
        className="flex items-center gap-1 whitespace-nowrap text-body2 font-body text-brand-black"
      >
        CV
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/arrow_downward.svg" alt="" width={16} height={16} className="shrink-0" />
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

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center rounded-[24px] border border-brand-black bg-brand-white">
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          className="flex items-center gap-2 whitespace-nowrap px-5 py-3 text-h3 font-heading text-brand-black"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/contact_me.svg" alt="" width={16} height={16} className="shrink-0" />
          Contact me
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="inline-links"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={transition}
              className="hidden items-center gap-6 overflow-hidden pr-5 md:flex"
            >
              <ContactLinks onEmailCopy={handleCopyEmail} copied={copied} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="stacked-links"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={transition}
            className="absolute right-0 top-full mt-2 flex min-w-[200px] flex-col items-start gap-3 rounded-2xl border border-brand-black bg-brand-white px-5 py-4 md:hidden"
          >
            <ContactLinks onEmailCopy={handleCopyEmail} copied={copied} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
