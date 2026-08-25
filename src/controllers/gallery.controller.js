import { GalleryService } from '../services/gallery.service.js';
import { Gallery } from '../models/Gallery.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export class GalleryController {
  static createItem = asyncHandler(async (req, res) => {
    const item = await GalleryService.createGalleryItem(req.body);
    return ApiResponse.success(res, 'Gallery item added successfully', item, HTTP_STATUS.CREATED);
  });

  static updateItem = asyncHandler(async (req, res) => {
    const item = await GalleryService.updateGalleryItem(req.params.id, req.body);
    return ApiResponse.success(res, 'Gallery item updated successfully', item);
  });

  static deleteItem = asyncHandler(async (req, res) => {
    await GalleryService.deleteGalleryItem(req.params.id);
    return ApiResponse.success(res, 'Gallery item deleted successfully');
  });

  static getAdminGallery = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const { items, total } = await GalleryService.getAdminGallery({ ...req.query, page, limit });
    return ApiResponse.paginated(res, 'Admin gallery list retrieved', items, { page, limit, total });
  });

  static getAdminGalleryById = asyncHandler(async (req, res) => {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Gallery record not found');
    }
    return ApiResponse.success(res, 'Gallery record retrieved', item);
  });

  static getPublicGallery = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const { items, total } = await GalleryService.getPublicGallery({ ...req.query, page, limit });
    return ApiResponse.paginated(res, 'Gallery media fetched', items, { page, limit, total });
  });

  static getCategories = asyncHandler(async (req, res) => {
    const categories = await GalleryService.getCategories();
    return ApiResponse.success(res, 'Gallery categories fetched', categories);
  });
}