import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export class ApiResponse {
  static success(res, message = 'Operation successful', data = null, statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static paginated(res, message = 'Data fetched successfully', data = [], meta = {}, statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta: {
        page: meta.page || 1,
        limit: meta.limit || 10,
        total: meta.total || 0,
        totalPages: meta.totalPages || Math.ceil((meta.total || 0) / (meta.limit || 10)),
      },
    });
  }
}