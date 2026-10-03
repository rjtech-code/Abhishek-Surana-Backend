import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },
    phone: { type: String, trim: true, maxlength: 20, default: '' },
    subject: { type: String, trim: true, maxlength: 150, default: '' },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

contactMessageSchema.index({ createdAt: -1 });

export const ContactMessage = mongoose.model(
  'ContactMessage',
  contactMessageSchema
);