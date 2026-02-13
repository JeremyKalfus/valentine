import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const YES_PAGES_DIR = path.join(process.cwd(), "content", "yes-pages");
const yesTemplates = ["falling-love", "language-wall", "first-text-timer", "photo-gallery", "note"] as const;

const yesPageFrontmatterSchema = z
  .object({
    slug: z.string().min(1),
    title: z.string().min(1),
    subtitle: z.string().optional(),
    template: z.enum(yesTemplates),
    buttonText: z.string().optional(),
    actionButtonText: z.string().optional(),
    photoDir: z.string().optional(),
    body: z.string().optional(),
    fallingText: z.string().optional(),
    languagePhrases: z.array(z.string().min(1)).optional(),
    startIso: z
      .string()
      .optional()
      .refine((value) => value === undefined || !Number.isNaN(Date.parse(value)), {
        message: "startIso must be a valid ISO datetime string"
      }),
    firstTextFromRebecca: z.string().optional(),
    firstTextFromMe: z.string().optional()
  })
  .superRefine((value, ctx) => {
    if (value.template === "first-text-timer" && !value.startIso) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startIso"],
        message: "startIso is required when template is first-text-timer"
      });
    }
  });

export type YesPageFrontmatter = z.infer<typeof yesPageFrontmatterSchema>;

export type YesPage = YesPageFrontmatter & {
  markdown: string;
  fileName: string;
};

function parseYesPageFile(filePath: string): YesPage | null {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const parsed = matter(fileContents);
    const frontmatter = yesPageFrontmatterSchema.safeParse(parsed.data);

    if (!frontmatter.success) {
      console.warn(`Skipping malformed yes page: ${filePath}`, frontmatter.error.flatten());
      return null;
    }

    return {
      ...frontmatter.data,
      markdown: parsed.content.trim(),
      fileName: path.basename(filePath)
    };
  } catch (error) {
    console.warn(`Failed reading yes page file: ${filePath}`, error);
    return null;
  }
}

export function getAllYesPages(): YesPage[] {
  if (!fs.existsSync(YES_PAGES_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(YES_PAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")))
    .map((entry) => path.join(YES_PAGES_DIR, entry.name));

  const pages = files.map(parseYesPageFile).filter((page): page is YesPage => page !== null);

  const deduped = new Map<string, YesPage>();
  for (const page of pages) {
    if (deduped.has(page.slug)) {
      console.warn(`Duplicate slug detected and skipped: ${page.slug}`);
      continue;
    }
    deduped.set(page.slug, page);
  }

  return Array.from(deduped.values()).sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getYesPageBySlug(slug: string): YesPage | null {
  return getAllYesPages().find((page) => page.slug === slug) ?? null;
}

export function getRandomYesPage(exceptSlug?: string): YesPage | null {
  const pages = getAllYesPages();
  if (pages.length === 0) {
    return null;
  }

  if (!exceptSlug || pages.length === 1) {
    return pages[Math.floor(Math.random() * pages.length)] ?? null;
  }

  const filtered = pages.filter((page) => page.slug !== exceptSlug);
  const source = filtered.length > 0 ? filtered : pages;
  return source[Math.floor(Math.random() * source.length)] ?? null;
}
