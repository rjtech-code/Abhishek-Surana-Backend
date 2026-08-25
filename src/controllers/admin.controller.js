import { Admin } from '../models/Admin.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export class AdminController {
  static getProfile = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.admin._id).select('-password');
    return ApiResponse.success(res, 'Admin account profile retrieved', admin);
  });

  static updateProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (email) {
      const exists = await Admin.findOne({ email, _id: { $ne: req.admin._id } });
      if (exists) {
        throw new ApiError(HTTP_STATUS.CONFLICT, 'Email is already in use by another account');
      }
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(req.admin._id, { $set: { name, email } }, { new: true, runValidators: true }).select('-password');

    return ApiResponse.success(res, 'Admin account details updated', updatedAdmin);
  });

  static changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin._id).select('+password');
    const isMatch = await admin.comparePassword(currentPassword);

    if (!isMatch) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Incorrect current password');
    }

    admin.password = newPassword;
    await admin.save();

    return ApiResponse.success(res, 'Password changed successfully');
  });
}