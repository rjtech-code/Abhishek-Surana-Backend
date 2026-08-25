import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export class AuthController {
  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { admin, token } = await AuthService.login(email, password);

    res.cookie(env.COOKIE_NAME, token, AuthService.getCookieOptions());

    return ApiResponse.success(res, 'Authentication successful', { admin, token });
  });

  static logout = asyncHandler(async (req, res) => {
    res.clearCookie(env.COOKIE_NAME, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });

    return ApiResponse.success(res, 'Logged out successfully');
  });

  static getMe = asyncHandler(async (req, res) => {
    return ApiResponse.success(res, 'Active admin session retrieved', { admin: req.admin });
  });
}