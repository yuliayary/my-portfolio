"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

// The single product-demo clip lives at fixed paths; if more case-study
// videos land later, lift these to props. Native ratio is 1920x1080 (16:9).
const SRC = "/media/mockup.mp4";
const POSTER = "/media/mockup-poster.jpeg";
// Beat between loops — the video isn't seamlessly looped; it pauses, then
// restarts (see the effect below).
const LOOP_PAUSE_MS = 3000;

// Chrome composites a playing <video> through a GPU hardware-overlay plane
// whose colour pipeline differs from the normal compositor. On some GPUs it
// briefly re-promotes the video mid-playback, which reads as a brightness
// "pop" (a flash that isn't in the source frames — confirmed by comparing the
// file against a screen recording). No CSS reliably keeps it off the overlay.
// So we never display the <video> at all: it's an off-screen decode source,
// and every frame is blitted onto a <canvas>. A canvas is a plain raster
// surface with no overlay path, so the pop cannot happen.
type RVFCVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: () => void) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

/**
 * A looping, chromeless product demo that reads as an embedded animation, not a
 * video player: muted, no controls, autoplays only once scrolled into view.
 * Honours prefers-reduced-motion by showing the poster still instead.
 */
export default function VideoEmbed({ alt }: { alt: string }) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useRef(false);

  useEffect(() => {
    const video = videoRef.current as RVFCVideo | null;
    const canvas = canvasRef.current;
    if (!video || !canvas || reduce) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Blit the current decoded frame onto the canvas (buffer is fixed at the
    // clip's native 1920x1080; the CSS box is 16:9 so it maps 1:1).
    let paintedFrame = false;
    const paint = () => {
      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        paintedFrame = true;
      }
    };

    // Draw pump: requestVideoFrameCallback fires once per presented frame while
    // playing and goes quiet when paused (leaving the last frame on the canvas);
    // rAF is the fallback for browsers without it.
    let handle = 0;
    const hasRVFC = typeof video.requestVideoFrameCallback === "function";
    const pumpRVFC = () => {
      paint();
      handle = video.requestVideoFrameCallback!(pumpRVFC);
    };
    const pumpRAF = () => {
      paint();
      handle = requestAnimationFrame(pumpRAF);
    };
    if (hasRVFC) handle = video.requestVideoFrameCallback!(pumpRVFC);
    else handle = requestAnimationFrame(pumpRAF);

    // Paint the poster so the canvas isn't blank before playback — but only if
    // no real video frame has been drawn yet (playback overwrites it).
    const poster = new window.Image();
    poster.onload = () => {
      if (!paintedFrame) ctx.drawImage(poster, 0, 0, canvas.width, canvas.height);
    };
    poster.src = POSTER;

    // Loop with a 3s beat: on end, wait, then restart — only while in view.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onEnded = () => {
      timer = setTimeout(() => {
        if (!inView.current) return;
        video.currentTime = 0;
        video.play().catch(() => {});
      }, LOOP_PAUSE_MS);
    };
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("ended", onEnded);
      if (timer) clearTimeout(timer);
      if (hasRVFC) video.cancelVideoFrameCallback?.(handle);
      else cancelAnimationFrame(handle);
    };
  }, [reduce]);

  // Reduced motion: never autoplay — show the poster still instead.
  if (reduce) {
    return (
      <figure className="mt-12 w-full">
        <Image
          src={POSTER}
          alt={alt}
          width={0}
          height={0}
          sizes="(min-width: 1280px) 1200px, 100vw"
          className="h-auto w-full rounded-[24px]"
        />
      </figure>
    );
  }

  return (
    // whileInView-style viewport detection drives playback: start on enter,
    // pause on leave. No entrance animation — the figure just appears in place.
    <motion.figure
      className="mt-12 w-full"
      viewport={{ amount: 0.4 }}
      onViewportEnter={() => {
        inView.current = true;
        videoRef.current?.play().catch(() => {});
      }}
      onViewportLeave={() => {
        inView.current = false;
        videoRef.current?.pause();
      }}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-[24px]">
        {/* Decode source only — kept behind the opaque canvas, never shown, so
            its overlay-compositing pop is never visible. */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={SRC} type="video/mp4" />
        </video>
        {/* Visible output: a plain raster surface with no video-overlay path. */}
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          role="img"
          aria-label={alt}
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </motion.figure>
  );
}
