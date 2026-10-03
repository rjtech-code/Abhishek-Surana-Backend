import { ContactService } from '../services/contact.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export class ContactController {
  // PUBLIC
  static createMessage = asyncHandler(async (req, res) => {
    await ContactService.createMessage(req.body);

    return ApiResponse.success(
      res,
      'Thank you! Your message has been sent.',
      { received: true },
      HTTP_STATUS.CREATED
    );
  });

  // ADMIN
  static getAdminMessages = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 15, 50);

    const { messages, total } = await ContactService.getAdminMessages({
      page,
      limit,
      status: req.query.status,
      search: req.query.search,
    });

    return ApiResponse.paginated(res, 'Messages retrieved', messages, {
      page,
      limit,
      total,
    });
  });

  static getUnreadCount = asyncHandler(async (req, res) => {
    const count = await ContactService.getUnreadCount();
    return ApiResponse.success(res, 'Unread count retrieved', { count });
  });

  static setRead = asyncHandler(async (req, res) => {
    const isRead = req.body?.isRead !== false;
    const message = await ContactService.setRead(req.params.id, isRead);
    return ApiResponse.success(res, 'Message updated', message);
  });

  static deleteMessage = asyncHandler(async (req, res) => {
    await ContactService.deleteMessage(req.params.id);
    return ApiResponse.success(res, 'Message deleted successfully');
  });
}