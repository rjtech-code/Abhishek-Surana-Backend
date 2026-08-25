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

const metricSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    icon: String,
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

const initiativeSchema = new mongoose.Schema(
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
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'upcoming'],
      default: 'ongoing',
    },
    year: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: 'District Churu',
    },
    coverImage: {
      type: imageSubSchema,
      required: true,
    },
    gallery: [imageSubSchema],
    problem: {
      type: String,
      required: true,
    },
    solution: {
      type: String,
      required: true,
    },
    implementation: {
      type: String,
      required: true,
    },
    impact: {
      type: String,
      required: true,
    },
    metrics: [metricSchema],
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
      default: false,
      index: true,
    },
    seo: {
      type: seoSubSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

initiativeSchema.index({ published: 1, order: 1, createdAt: -1 });

export const Initiative = mongoose.model('Initiative', initiativeSchema);