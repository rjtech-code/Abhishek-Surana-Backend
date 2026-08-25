import mongoose from 'mongoose';
import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected internal error occurred';
    let errors = [];

    if (err instanceof mongoose.Error.CastError) {
      statusCode = HTTP_STATUS.BAD_REQUEST;
      message = `Invalid format for field: ${err.path}`;
    } else if (err.code === 11000) {
      statusCode = HTTP_STATUS.CONFLICT;
      const field = Object.keys(err.keyValue || {})[0] || 'field';
      message = `A record with this ${field} already exists`;
    } else if (err instanceof mongoose.Error.ValidationError) {
      statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
      message = 'Database validation failed';
      errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    } else if (err instanceof multer.MulterError) {
      statusCode = HTTP_STATUS.BAD_REQUEST;
      message = `Upload error: ${err.message}`;
    } else if (err.name === 'JsonWebTokenError') {
      statusCode = HTTP_STATUS.UNAUTHORIZED;
      message = 'Invalid authentication token';
    }

    error = new ApiError(statusCode, message, errors);
  }

  if (error.statusCode >= 500) {
    logger.error(`[CRITICAL] ${req.method} ${req.originalUrl} - ${err.message}`, { stack: err.stack });
  } else {
    logger.warn(`[WARN] ${req.method} ${req.originalUrl} - ${error.statusCode} - ${error.message}`);
  }

  const responsePayload = {
    success: false,
    message: error.message,
    errors: error.errors || [],
  };

  if (env.NODE_ENV === 'development' && error.statusCode >= 500) {
    responsePayload.devStack = err.stack;
  }

  return res.status(error.statusCode).json(responsePayload);
};