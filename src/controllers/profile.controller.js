import { ProfileService } from '../services/profile.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class ProfileController {
  static getPublicProfile = asyncHandler(async (req, res) => {
    const profile = await ProfileService.getProfile();
    return ApiResponse.success(res, 'Public profile information retrieved', profile);
  });

  static getAdminProfileContent = asyncHandler(async (req, res) => {
    const profile = await ProfileService.getProfile();
    return ApiResponse.success(res, 'Profile content retrieved for admin management', profile);
  });

  static updateProfileContent = asyncHandler(async (req, res) => {
    const updated = await ProfileService.updateProfile(req.body);
    return ApiResponse.success(res, 'Profile information updated successfully', updated);
  });
}