# CLAUDE.md

@AGENTS.md

Persistent context for Claude Code on this project. Read this before making changes — it saves repeating the same context in every prompt.

## Project

Personal UX/UI portfolio site for Yuliia Yaryna, a UX designer/researcher. Built with a "vibecoding" approach — hands-on, section-by-section, using Figma frames as visual reference rather than a no-code builder.

## Stack

* Framework: Next.js (App Router) + TypeScript
* Styling: Tailwind CSS
* Animation: Framer Motion
* Content: Markdown files with frontmatter (case study copy lives in the repo, not fetched from Notion — Claude Code can't reliably read live Notion pages since they're JS-rendered)
* Hosting/CI: GitHub → Vercel

## Design reference workflow

Design happens in Figma first. Figma frames are provided as pasted screenshots — this is the permanent workflow (no Figma Dev Mode / MCP access, since that requires a paid Figma seat). So:

* Screenshots convey layout/hierarchy but not exact pixel spacing. If precise spacing matters and isn't given explicitly, ask rather than guess.
* Spacing values are always divisible by 4 or 8 (following an 8pt-ish grid). When a screenshot shows spacing that's close to a round Tailwind value (4, 8, 16, 24, 32px, etc.), use that value directly rather than asking — don't guess odd numbers like 22px or 13px. Only ask when a measurement doesn't cleanly resolve to one of these values, or when the ambiguity affects overall layout/structure (not just a few px of padding).
* Design tokens (colors, type) are listed below and should be used via Tailwind config, not hardcoded hex/px values inline.

## Design tokens

**Colors** (add to `tailwind.config` as named tokens, e.g. `brand-blue`, `grey-light` — don't hardcode hex in components):

* White: `#F4F5F9`
* Light grey: `#848383`
* Dark grey: `#534C4C`
* Black: `#272727`
* Blue: `#291BF3`

**Typography:**

* Headings: "Stack Sans Notch", Regular — confirmed available via Google Fonts, licensed under SIL Open Font License (OFL v1.1), free for commercial use. Load via `next/font/google`.
   * H1: 48px / 120% line-height
   * H2: 32px / 120% line-height
   * H3: 24px / 120% line-height
   * H4: 20px / 120% line-height
* Body: "Geist", Regular
   * Body1: 20px / 100% line-height
   * Body2: 16px / 100% line-height
* Font weights: Regular only for both Stack Sans Notch and Geist. Emphasis (nav states, buttons, active/hover) should be achieved via color, size, spacing, or borders — not font-weight, since no bold/medium weight is loaded.

## Folder structure

```
my-portfolio/
├── app/
│   ├── page.tsx                       → Home page
│   └── work/
│       └── [slug]/
│           └── page.tsx               → shared template for all case studies
│
├── components/
│   ├── sections/                      → homepage sections, one file each
│   │   ├── Header.tsx                 → sticky, includes "Contact me" trigger
│   │   ├── Hero.tsx
│   │   ├── WorkGrid.tsx               → links to case studies
│   │   └── Footer.tsx
│   ├── ContactModal.tsx               → popup triggered from Header
│   └── ui/                            → shared small pieces (buttons, tags)
│
├── content/
│   └── case-studies/
│       ├── project-one.md
│       └── project-two.md             → adding future projects = new files here (up to 5 total)
│
└── public/
    └── images/
```

## Conventions

* One component per section (hero, work grid, footer, etc.) — not monolithic page files.
* Tailwind utility classes first; only extend `tailwind.config` when a needed token genuinely doesn't exist yet.
* Semantic HTML, one `h1` per page, alt text on all images/icons, visible focus states on interactive elements.
* Mobile-first, responsive. Verify at 375px, 768px, 1280px+.
* Don't invent real copy or brand assets (icons, logos). Use clearly-marked placeholders (`// TODO: ...`) instead of guessing silently.
* Header is sticky (persistent on scroll), background stays constant (no color/shadow change on scroll).
   * At the top of the page: header shows only the "Contact me" button.
   * Once the Hero's decorative mark scrolls out of view: "Yuliia Yaryna" fades in smoothly on the left side of the header (and fades out if scrolled back to the top). Tracked with an IntersectionObserver on that mark, not on the section as a whole. "Contact me" button remains visible throughout.
   * "Contact me" opens ContactModal — not a separate page/route.
* WorkGrid displays case studies as a grid of cards, side by side.
   * Each card shows image, title (H3, steps to H4 on mobile), and a short project-type line beneath it (Body2, light grey — e.g. "Website design"). No description or tags.
   * Two columns on desktop, one on mobile. Card image is 4:3 with a 24px corner radius.
   * Hover animation: a "lighting up" effect, smooth/slow-ish timing. Exact visual treatment not yet decided — // TODO: decide exact hover animation. Whether it applies to all cards or just the first case study card is also undecided — // TODO: decide scope (all cards vs. first card only). Ask before implementing rather than guessing.

## Animation philosophy

Aim for one or two high-quality animated moments per page rather than animating everything — this is a deliberate scope decision, not an oversight. Default to static/no-animation unless a section is explicitly called out as the animated one. Any animation must respect `prefers-reduced-motion` and stay performant.

* Candidates for the 1-2 high-quality animated moments: the header name fade-in/out on scroll, and the WorkGrid card "lighting up" hover effect (details TBD).

## Version control

* Commit after each section is built and confirmed working — not before confirmation, and not multiple sections batched into one commit.
* Commit messages should be short and descriptive of what was built (e.g. "Add sticky header with contact modal trigger"), not generic ("update files").
* "Confirmed working" means Yuliia has visually checked it in the browser — no build/lint step required before committing.

## When building a section or page

* Work on one section/page at a time. Don't modify unrelated files unless asked.
* If a screenshot or instruction is ambiguous (spacing, breakpoint behavior, hover/active states, what a button links to), ask — don't guess silently.
* After building, summarize what was built, what used placeholder assets/copy, and any deviations from the reference and why.
