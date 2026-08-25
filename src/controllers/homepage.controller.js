import { HomepageService } from '../services/homepage.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class HomepageController {
  static getPublicHomepage = asyncHandler(async (req, res) => {
    const homepage = await HomepageService.getHomepageContent();
    return ApiResponse.success(res, 'Homepage content loaded', homepage);
  });

  static getAdminHomepage = asyncHandler(async (req, res) => {
    const homepage = await HomepageService.getHomepageContent();
    return ApiResponse.success(res, 'Admin homepage configuration retrieved', homepage);
  });

  static updateHomepage = asyncHandler(async (req, res) => {
    const updated = await HomepageService.updateHomepageContent(req.body);
    return ApiResponse.success(res, 'Homepage configuration updated successfully', updated);
  });
}