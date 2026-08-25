import { z } from "zod";
import { REACTION_TYPES } from "../constants/index.js";

export const addReactionSchema =
  z.object({
    body: z.object({
      visitorId: z
        .string()
        .min(
          5,
          "Visitor ID must be provided"
        ),

      reactionType:
        z
          .enum(REACTION_TYPES)
          .nullable(),
    }),
  });