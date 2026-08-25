import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { Admin } from "../models/Admin.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token = null;

  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  }

  if (!token && req.cookies?.[env.COOKIE_NAME]) {
    token = req.cookies[env.COOKIE_NAME];
  }

  if (!token) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Authentication required."
    );
  }

  let decoded;

  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    console.error("JWT verification failed:", error.name, error.message);

    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Invalid authentication token."
    );
  }

  if (!decoded?.id) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Invalid authentication payload."
    );
  }

  const admin = await Admin.findById(decoded.id)
    .select("-password")
    .lean();

  if (!admin) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Admin account not found."
    );
  }

  req.admin = admin;

  next();
});

export const requireAdmin = (req, res, next) => {
  if (!req.admin) {
    return next(
      new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Authentication required."
      )
    );
  }

  const allowedRoles = ["admin", "super-admin"];

  if (!allowedRoles.includes(req.admin.role)) {
    return next(
      new ApiError(
        HTTP_STATUS.FORBIDDEN,
        "Administrative privileges required."
      )
    );
  }

  next();
};