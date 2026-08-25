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

const seoSubSchema = new mongoose.Schema(
  {
    metaTitle: String,
    metaDescription: String,
    ogImage: String,
    keywords: [String],
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: imageSubSchema,
      required: true,
    },
    gallery: [imageSubSchema],
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    tags: {
      type: [String],
      index: true,
      default: [],
    },
    author: {
      type: String,
      default: 'Abhishek Surana, IAS',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    readingTimeMinutes: {
      type: Number,
      default: 1,
    },
    seo: {
      type: seoSubSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

blogSchema.index({ status: 1, publishedAt: -1 });

export const Blog = mongoose.model('Blog', blogSchema);