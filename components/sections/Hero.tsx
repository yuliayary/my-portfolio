export default function Hero() {
  // Mobile anchors the content with an explicit top offset; desktop centers it.
  return (
    <section
      id="hero"
      className="flex min-h-screen flex-col justify-start px-4 pt-[248px] sm:px-6 md:justify-center md:px-10 md:pt-0"
    >
      {/* Type steps down to H3 on mobile so each phrase keeps its own line. */}
      <h1 className="font-heading text-h3 text-grey-light md:text-h1">
        I&apos;m Yuliia Yaryna,
        <br />
        <span className="text-brand-black">a UX designer and researcher</span>
        <br />
        from Kyiv and based in Berlin.
      </h1>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        id="hero-mark"
        src="/ccc.svg"
        alt=""
        width={104}
        height={36}
        className="mt-6 h-auto w-[52px] shrink-0 md:mt-12 md:w-[104px]"
      />
    </section>
  );
}
