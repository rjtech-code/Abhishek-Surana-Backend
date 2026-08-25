import { CloudinaryService } from '../services/cloudinary.service.js';
import { CLOUDINARY_FOLDERS } from '../constants/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export class UploadController {
  static uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Please attach an image file in form-data under key "image"');
    }

    const folderKey = req.body.folder || 'blogs';
    const folder = CLOUDINARY_FOLDERS[folderKey.toUpperCase()] || CLOUDINARY_FOLDERS.BLOGS;

    const uploaded = await CloudinaryService.uploadBuffer(req.file.buffer, folder);

    return ApiResponse.success(res, 'Image uploaded to Cloudinary successfully', uploaded, HTTP_STATUS.CREATED);
  });
}