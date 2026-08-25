import { z } from 'zod';

const imageObjectSchema = z.object({
  public_id: z.string().min(1),
  secure_url: z.string().url(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  resource_type: z.string().optional(),
});

export const updateProfileContentSchema = z.object({
  body: z.object({
    officerName: z.string().optional(),
    designation: z.string().optional(),
    cadre: z.string().optional(),
    batch: z.string().optional(),
    portrait: imageObjectSchema.nullable().optional(),
    biography: z.string().optional(),
    education: z
      .array(
        z.object({
          degree: z.string(),
          institution: z.string(),
          year: z.string(),
        })
      )
      .optional(),
    leadershipStatement: z.string().optional(),
    vision: z.string().optional(),
    contactInfo: z
      .object({
        officeAddress: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
      })
      .optional(),
    socialLinks: z
      .object({
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        instagram: z.string().optional(),
        facebook: z.string().optional(),
      })
      .optional(),
  }),
});