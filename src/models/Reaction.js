import mongoose from "mongoose";
import { REACTION_TYPES } from "../constants/index.js";

const reactionSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },

    visitorId: {
      type: String,
      required: true,
      trim: true,
    },

    reactionType: {
      type: String,
      enum: REACTION_TYPES,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * One visitor can have only ONE reaction
 * on one blog.
 */
reactionSchema.index(
  {
    blog: 1,
    visitorId: 1,
  },
  {
    unique: true,
  }
);

export const Reaction =
  mongoose.model("Reaction", reactionSchema);