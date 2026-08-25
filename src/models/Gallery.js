import mongoose from 'mongoose';

const imageSubSchema = new mongoose.Schema(
  {
    public_id: { type: String, required: true },
    secure_url: { type: String, required: true },
    width: Number,
    height: Number,
    format: String,
    resource_type: String,
  },
  { _id: false }
);

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: imageSubSchema,
      required: true,
    },
    alt: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    location: {
      type: String,
      default: 'District Churu, Rajasthan',
    },
    year: {
      type: String,
      default: () => new Date().getFullYear().toString(),
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

gallerySchema.index({ published: 1, order: 1, createdAt: -1 });

export const Gallery = mongoose.model('Gallery', gallerySchema);