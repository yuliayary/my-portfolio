import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

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

  // Fallback: any leftover markdown image renders as a placeholder too.
  img({ alt }) {
    return <ImagePlaceholder label={alt ?? "Image"} />;
  },
};

export default function CaseStudyBody({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
