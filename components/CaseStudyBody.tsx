import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import VideoEmbed from "@/components/VideoEmbed";
import ResponsiveScreens, { type Shot } from "@/components/ResponsiveScreens";
import { getImageSize } from "@/lib/image-size";

// The id given to the "The result" heading so the "Jump to result" button in
// the page header can anchor to it. Kept in sync with slugify() below.
export const RESULT_ANCHOR = "the-result";

// Running text sits in a narrow, centered column; images break out to the full
// width of the article container (see the Figma frame).
const COLUMN = "mx-auto w-full max-w-[35rem]";

type HastNode = {
  type: string;
  value?: string;
  tagName?: string;
  properties?: { src?: string; alt?: string; title?: string };
  children?: HastNode[];
};

function nodeText(node?: HastNode): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(nodeText).join("");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * A real content image (natural aspect ratio, rounded). Full-bleed by default;
 * pass `narrow` (via a `"narrow"` markdown image title) to cap it at the text
 * column width so it lines up with the running copy.
 */
function ContentImage({ src, alt, narrow }: { src: string; alt: string; narrow?: boolean }) {
  // Real intrinsic dimensions let next/image reserve the aspect-ratio box up
  // front; `h-auto w-full` then scales it responsively (spanning the article, or
  // the text column when narrow, capped by the shell on wide screens).
  const { width, height } = getImageSize(src);
  return (
    <figure className={`mt-12 ${narrow ? COLUMN : "w-full"}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={narrow ? "(min-width: 560px) 560px, 100vw" : "(min-width: 1280px) 1200px, 100vw"}
        className="h-auto w-full rounded-[24px]"
      />
    </figure>
  );
}

/** Two or more images side by side (one column on mobile). */
function ImageRow({ images }: { images: { src: string; alt: string }[] }) {
  return (
    <div className="mt-12 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
      {images.map((im, i) => {
        const { width, height } = getImageSize(im.src);
        return (
          <figure key={i} className="w-full">
            <Image
              src={im.src}
              alt={im.alt}
              width={width}
              height={height}
              sizes="(min-width: 768px) 590px, 100vw"
              className="h-auto w-full rounded-[24px]"
            />
          </figure>
        );
      })}
    </div>
  );
}

/** A grey rounded image slot — replaced with real exports once available. */
function ImagePlaceholder({ label }: { label: string }) {
  const caption = label.replace(/^image:?\s*/i, "").trim() || "Image";
  return (
    <figure className="mt-12 w-full">
      {/* TODO: swap for the exported image (next/image) once assets land. */}
      <div
        role="img"
        aria-label={`Image placeholder: ${caption}`}
        className="flex aspect-[3/2] w-full items-center justify-center rounded-[24px] bg-[#d9d9d9] px-6 text-center"
      >
        <span className="font-body text-body2 text-grey-dark">{caption}</span>
      </div>
    </figure>
  );
}

/** Closing link back to the work grid. */
function NextCaseLink() {
  return (
    <div className="mt-16 flex justify-center">
      <a
        href="/#work"
        className="inline-flex items-center rounded-full border border-brand-black px-6 py-3 font-heading text-h4 text-brand-black transition-colors hover:bg-brand-black hover:text-brand-white"
      >
        Check another case study
      </a>
    </div>
  );
}

const components: Components = {
  h2({ node, children }) {
    const id = slugify(nodeText(node as unknown as HastNode));
    return (
      <h2
        id={id}
        className={`${COLUMN} mt-16 mb-2 scroll-mt-28 font-heading text-h4 text-brand-black md:text-h3`}
      >
        {children}
      </h2>
    );
  },

  p({ node, children }) {
    const el = node as unknown as HastNode;
    const kids = (el.children ?? []).filter(
      (c) => !(c.type === "text" && !(c.value ?? "").trim()),
    );

    // A paragraph of only images renders full-bleed (outside the narrow text
    // column). One image spans the width; two or more sit side by side.
    // Markdown groups images written on consecutive lines into one paragraph.
    const imgKids = kids.filter((c) => c.type === "element" && c.tagName === "img");
    if (imgKids.length > 0 && imgKids.length === kids.length) {
      const images = imgKids.map((img) => ({
        src: String(img.properties?.src ?? ""),
        alt: String(img.properties?.alt ?? ""),
        title: img.properties?.title,
      }));

      // Images tagged with a "desktop"/"mobile" title become a responsive block:
      // the desktop composite on md+, and the mobile screen(s) — a swipeable
      // carousel when there are several — on small screens.
      const hasResponsive = images.some(
        (im) => im.title === "desktop" || im.title === "mobile",
      );
      if (hasResponsive) {
        const toShot = (im: { src: string; alt: string }): Shot => ({
          src: im.src,
          alt: im.alt,
          ...getImageSize(im.src),
        });
        const desktop = images.filter((im) => im.title === "desktop");
        const mobile = images.filter((im) => im.title === "mobile");
        return (
          <ResponsiveScreens
            desktop={desktop.map(toShot)}
            mobile={mobile.map(toShot)}
          />
        );
      }

      return images.length === 1 ? (
        // An image titled "narrow" is capped at the text column width.
        <ContentImage src={images[0].src} alt={images[0].alt} narrow={images[0].title === "narrow"} />
      ) : (
        <ImageRow images={images} />
      );
    }

    // A paragraph that is entirely italic becomes a pulled-out callout
    // (the "How might we…" questions and the client quote).
    if (kids.length === 1 && kids[0].type === "element" && kids[0].tagName === "em") {
      return (
        <p
          className={`${COLUMN} mt-8 border-l-2 border-brand-blue pl-4 font-body text-body2 italic text-brand-black md:text-body1`}
        >
          {children}
        </p>
      );
    }

    // A paragraph that is only a [bracket] marker is a placeholder slot.
    const bracket = nodeText(el).trim().match(/^\[(.+)\]$/);
    if (bracket) {
      const label = bracket[1].trim();
      if (/^check another case study$/i.test(label)) return <NextCaseLink />;
      // A [video: alt text] marker renders the embedded product-demo clip;
      // the text after the colon becomes its accessible label.
      const video = label.match(/^video:?\s*(.*)$/i);
      if (video) return <VideoEmbed alt={video[1].trim() || "Product demo"} />;
      return <ImagePlaceholder label={label} />;
    }

    return (
      <p className={`${COLUMN} mt-6 font-body text-body2 leading-[1.6] text-brand-black`}>
        {children}
      </p>
    );
  },

  ul({ children }) {
    return (
      <ul
        className={`${COLUMN} mt-6 list-disc space-y-2 pl-5 font-body text-body2 leading-[1.6] text-brand-black marker:text-grey-light`}
      >
        {children}
      </ul>
    );
  },

  a({ href, children }) {
    const external = href?.startsWith("http");
    return (
      <a
        href={href}
        className="text-brand-blue underline underline-offset-2"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },

  // Fallback for any image not caught as a standalone paragraph above.
  img({ src, alt, title }) {
    if (!src) return <ImagePlaceholder label={alt ?? "Image"} />;
    return <ContentImage src={String(src)} alt={alt ?? ""} narrow={title === "narrow"} />;
  },
};

export default function CaseStudyBody({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
