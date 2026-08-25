import { z } from 'zod';

const imageObjectSchema = z.object({
  public_id: z.string().min(1),
  secure_url: z.string().url(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  resource_type: z.string().optional(),
});

export const updateHomepageSchema = z.object({
  body: z.object({
    hero: z
      .object({
        eyebrow: z.string().optional(),
        headline: z.string().optional(),
        subheadline: z.string().optional(),
        portrait: imageObjectSchema.nullable().optional(),
        primaryCta: z
          .object({
            label: z.string(),
            link: z.string(),
          })
          .optional(),
        secondaryCta: z
          .object({
            label: z.string(),
            link: z.string(),
          })
          .optional(),
      })
      .optional(),
    leadership: z
      .object({
        heading: z.string().optional(),
        description: z.string().optional(),
        quote: z.string().optional(),
      })
      .optional(),
    impactStats: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
          icon: z.string().optional(),
          order: z.number().optional(),
          active: z.boolean().optional(),
        })
      )
      .optional(),
    featuredBlogIds: z.array(z.string()).optional(),
    featuredInitiativeIds: z.array(z.string()).optional(),
    galleryPreviewCount: z.number().optional(),
  }),
});