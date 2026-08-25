import mongoose from 'mongoose';
import { COMMENT_STATUS } from '../constants/index.js';

const commentSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
      index: true,
    },
    visitorId: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: COMMENT_STATUS,
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

commentSchema.index({ blog: 1, status: 1, createdAt: -1 });

export const Comment = mongoose.model('Comment', commentSchema);