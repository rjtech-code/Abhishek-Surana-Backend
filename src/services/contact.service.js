import { ContactMessage } from '../models/ContactMessage.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const clean = (v) => String(v ?? '').trim();

export class ContactService {
  static async createMessage(payload = {}) {
    // Honeypot: real users never fill this hidden field, bots do.
    if (clean(payload.website)) return null;

    const name = clean(payload.name);
    const email = clean(payload.email).toLowerCase();
    const phone = clean(payload.phone);
    const subject = clean(payload.subject);
    const message = clean(payload.message);

    if (name.length < 2 || name.length > 100) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Please enter a valid name.');
    }
    if (!EMAIL_RE.test(email) || email.length > 150) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Please enter a valid email.');
    }
    if (phone && !PHONE_RE.test(phone)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        'Please enter a valid phone number.'
      );
    }
    if (subject.length > 150) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Subject is too long.');
    }
    if (message.length < 10 || message.length > 2000) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        'Message must be between 10 and 2000 characters.'
      );
    }

    return ContactMessage.create({ name, email, phone, subject, message });
  }

  static async getAdminMessages({ page = 1, limit = 15, status, search } = {}) {
    const filter = {};

    if (status === 'unread') filter.isRead = false;
    if (status === 'read') filter.isRead = true;

    const q = clean(search);
    if (q) {
      const rx = new RegExp(escapeRegex(q), 'i');
      filter.$or = [
        { name: rx },
        { email: rx },
        { subject: rx },
        { message: rx },
      ];
    }

    const [messages, total] = await Promise.all([
      ContactMessage.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ContactMessage.countDocuments(filter),
    ]);

    return { messages, total };
  }

  static async getUnreadCount() {
    return ContactMessage.countDocuments({ isRead: false });
  }

  static async setRead(id, isRead) {
    const doc = await ContactMessage.findByIdAndUpdate(
      id,
      { isRead, readAt: isRead ? new Date() : null },
      { new: true }
    );

    if (!doc) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Message not found');
    return doc;
  }

  static async deleteMessage(id) {
    const doc = await ContactMessage.findByIdAndDelete(id);
    if (!doc) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Message not found');
  }
}