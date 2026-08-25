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

const profileSchema = new mongoose.Schema(
  {
    isSingleton: {
      type: Boolean,
      default: true,
      unique: true,
    },
    officerName: {
      type: String,
      required: true,
      default: 'Abhishek Surana',
    },
    designation: {
      type: String,
      required: true,
      default: 'District Magistrate & Collector',
    },
    cadre: {
      type: String,
      required: true,
      default: 'IAS (Rajasthan Cadre)',
    },
    batch: {
      type: String,
      required: true,
      default: '2018',
    },
    portrait: {
      type: imageSubSchema,
      default: null,
    },
    biography: {
      type: String,
      required: true,
    },
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    leadershipStatement: {
      type: String,
      default: '',
    },
    vision: {
      type: String,
      default: '',
    },
    contactInfo: {
      officeAddress: String,
      email: String,
      phone: String,
    },
    socialLinks: {
      twitter: String,
      linkedin: String,
      instagram: String,
      facebook: String,
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model('Profile', profileSchema);