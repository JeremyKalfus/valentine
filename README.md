# Valentine Site (Next.js)

A modular valentine website built with Next.js, TypeScript, and file-based random YES pages.

## Stack

- Next.js (App Router)
- TypeScript (strict)
- Zod for frontmatter validation
- Markdown/MDX file-per-page content
- Vercel-ready deployment config

## Run

```bash
npm install
npm run dev
```

## Add a new YES page

1. Create a new `.mdx` file in `content/yes-pages/`.
2. Add valid frontmatter:

```mdx
---
slug: my-new-page
title: My title
template: note
buttonText: Another random page
---
Optional markdown body.
```

3. Done. It is auto-discovered and included in random routing.

## Templates

- `falling-love`
- `language-wall`
- `first-text-timer`
- `note`

## Commands

- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
