import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

const createLimiter = (windowMinutes, maxRequests, message) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      next(new ApiError(HTTP_STATUS.TOO_MANY_REQUESTS, message));
    },
  });
};

export const globalLimiter = createLimiter(15, 300, 'Too many requests from this IP, please try again in 15 minutes.');
export const authLimiter = createLimiter(15, 10, 'Too many login attempts. Account temporarily throttled. Please try again after 15 minutes.');
export const commentLimiter = createLimiter(10, 10, 'Comment rate limit reached. Please wait before submitting more comments.');
export const reactionLimiter = createLimiter(5, 30, 'Action rate limit reached. Please slow down.');