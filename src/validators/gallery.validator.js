import { z } from 'zod';

const imageObjectSchema = z.object({
  public_id: z.string().min(1),
  secure_url: z.string().url(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  resource_type: z.string().optional(),
});

export const createGallerySchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title is required'),
    image: imageObjectSchema,
    alt: z.string().min(2, 'Alt text is required for accessibility'),
    caption: z.string().optional().default(''),
    category: z.string().min(2, 'Category is required'),
    location: z.string().optional().default('District Churu, Rajasthan'),
    year: z.string().optional(),
    featured: z.boolean().optional().default(false),
    order: z.number().optional().default(0),
    published: z.boolean().optional().default(true),
  }),
});

export const updateGallerySchema = z.object({
  body: createGallerySchema.shape.body.partial(),
});