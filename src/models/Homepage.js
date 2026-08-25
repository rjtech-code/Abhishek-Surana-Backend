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

const impactStatSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    icon: { type: String, default: 'chart' },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { _id: true }
);

const homepageSchema = new mongoose.Schema(
  {
    isSingleton: {
      type: Boolean,
      default: true,
      unique: true,
    },
    hero: {
      eyebrow: { type: String, default: 'Official Portal' },
      headline: { type: String, required: true, default: 'District Administration Churu' },
      subheadline: { type: String, default: 'Dedicated to transparent, citizen-centric, and sustainable governance.' },
      portrait: { type: imageSubSchema, default: null },
      primaryCta: {
        label: { type: String, default: 'Explore Initiatives' },
        link: { type: String, default: '/initiatives' },
      },
      secondaryCta: {
        label: { type: String, default: 'Read Insights' },
        link: { type: String, default: '/blogs' },
      },
    },
    leadership: {
      heading: { type: String, default: 'District Collector Message' },
      description: { type: String, default: '' },
      quote: { type: String, default: '' },
    },
    impactStats: [impactStatSchema],
    featuredBlogIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    featuredInitiativeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Initiative' }],
    galleryPreviewCount: { type: Number, default: 6 },
  },
  { timestamps: true }
);

export const Homepage = mongoose.model('Homepage', homepageSchema);