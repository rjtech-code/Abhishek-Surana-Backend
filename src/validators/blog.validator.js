import { z } from "zod";

const parseBoolean = (value) => {
  if (value === true || value === "true") {
    return true;
  }

  if (value === false || value === "false") {
    return false;
  }

  return false;
};

const parseTags = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Treat as comma-separated tags.
    }

    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const multipartBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(
      3,
      "Title is required and must be at least 3 characters"
    ),

  excerpt: z
    .string()
    .trim()
    .min(
      10,
      "Excerpt must be at least 10 characters"
    ),

  content: z
    .string()
    .trim()
    .min(
      20,
      "Content must be at least 20 characters"
    ),

  category: z
    .string()
    .trim()
    .min(
      2,
      "Category is required"
    ),

  tags: z.preprocess(
    parseTags,
    z.array(z.string()).default([])
  ),

  status: z
    .enum(["draft", "published"])
    .default("draft"),

  featured: z.preprocess(
    parseBoolean,
    z.boolean().default(false)
  ),

  author: z
    .string()
    .optional(),

  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      ogImage: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
});

export const createBlogSchema = z.object({
  body: multipartBodySchema,
});

export const updateBlogSchema = z.object({
  body: multipartBodySchema.partial(),
});