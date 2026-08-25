import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { env } from "../config/env.js";

export class AuthService {
  static generateToken(adminId) {
    return jwt.sign(
      {
        id: adminId.toString(),
      },
      env.JWT_SECRET,
      {
        expiresIn: env.JWT_EXPIRES_IN,
      }
    );
  }

  static async login(email, password) {
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Invalid credentials"
      );
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Invalid credentials"
      );
    }

    const token = this.generateToken(admin._id);

    const adminObject = admin.toObject();
    delete adminObject.password;

    return {
      admin: adminObject,
      token,
    };
  }

  static getCookieOptions() {
    return {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite:
        env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge:
        env.COOKIE_MAX_AGE_DAYS *
        24 *
        60 *
        60 *
        1000,
      path: "/",
    };
  }
}