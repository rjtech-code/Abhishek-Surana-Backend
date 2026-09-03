import { z } from "zod";

/* =========================================================
   METRIC
========================================================= */

const metricSchema = z.object({
  label: z.string().trim().min(1, "Metric label is required"),
  value: z.string().trim().min(1, "Metric value is required"),
  icon: z.string().optional(),
});

/* =========================================================
   CREATE
========================================================= */

export const createInitiativeSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(3, "Title is required"),

    summary: z
      .string()
      .trim()
      .min(10, "Summary must be at least 10 characters"),

    category: z
      .string()
      .trim()
      .min(2, "Category is required"),

    status: z
      .enum(["ongoing", "completed", "upcoming"])
      .default("ongoing"),

    year: z
      .string()
      .trim()
      .regex(/^\d{4}$/, "Year must be a valid 4-digit year"),

    location: z
      .string()
      .trim()
      .default("District Churu"),

    /*
     * IMPORTANT:
     * coverImage is intentionally NOT here.
     *
     * Frontend sends it as an actual multipart file:
     *
     * req.files.coverImage
     *
     * InitiativeService uploads it to Cloudinary.
     */

    /*
     * gallery is also intentionally NOT here.
     *
     * Frontend sends:
     *
     * req.files.gallery
     */

    problem: z
      .string()
      .trim()
      .min(10, "Problem description required"),

    solution: z
      .string()
      .trim()
      .min(10, "Solution description required"),

    implementation: z
      .string()
      .trim()
      .min(10, "Implementation details required"),

    impact: z
      .string()
      .trim()
      .min(10, "Impact statement required"),

    /*
     * These are currently not sent by your InitiativeEditor,
     * but keeping them optional makes the API future-safe.
     */
    metrics: z
      .array(metricSchema)
      .optional()
      .default([]),

    featured: z
      .boolean()
      .optional()
      .default(false),

    order: z
      .number()
      .optional()
      .default(0),

    published: z
      .preprocess((val) => {
        if (typeof val === "string") return val === "true";
        return val;
      }, z.boolean())
      .optional()
      .default(false),
    seo: z
      .object({
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        ogImage: z.string().optional(),
        keywords: z.array(z.string()).optional(),
      })
      .optional(),
  }),
});

/* =========================================================
   UPDATE
========================================================= */

export const updateInitiativeSchema = z.object({
  body: createInitiativeSchema.shape.body.partial(),
});
