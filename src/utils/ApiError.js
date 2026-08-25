import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export class ApiError extends Error {
  constructor(statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, message = 'Something went wrong', errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}