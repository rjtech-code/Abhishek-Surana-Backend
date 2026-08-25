import { Gallery } from '../models/Gallery.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { CloudinaryService } from './cloudinary.service.js';

export class GalleryService {
  static async createGalleryItem(data) {
    return Gallery.create(data);
  }

  static async updateGalleryItem(id, data) {
    const item = await Gallery.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
    if (!item) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Gallery item not found');
    }
    return item;
  }

  static async deleteGalleryItem(id) {
    const item = await Gallery.findById(id);
    if (!item) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Gallery item not found');
    }

    if (item.image?.public_id) {
      await CloudinaryService.deleteAsset(item.image.public_id);
    }

    await Gallery.findByIdAndDelete(id);
    return true;
  }

  static async getPublicGallery({ page = 1, limit = 12, category, featured, sort = 'order -createdAt' }) {
    const query = { published: true };

    if (category) query.category = category;
    if (featured !== undefined) query.featured = featured === 'true' || featured === true;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Gallery.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Gallery.countDocuments(query),
    ]);

    return { items, total, page, limit };
  }

  static async getAdminGallery({ page = 1, limit = 12, category, published, sort = '-createdAt' }) {
    const query = {};

    if (category) query.category = category;
    if (published !== undefined) query.published = published === 'true' || published === true;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Gallery.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Gallery.countDocuments(query),
    ]);

    return { items, total, page, limit };
  }

  static async getCategories() {
    return Gallery.distinct('category', { published: true });
  }
}