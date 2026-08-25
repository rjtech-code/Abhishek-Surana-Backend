import { CommentService } from '../services/comment.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';

export class CommentController {
  static addComment = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const comment = await CommentService.addComment(blogId, req.body);
    return ApiResponse.success(res, 'Your comment has been submitted and is awaiting administrative moderation.', comment, HTTP_STATUS.CREATED);
  });

  static getPublicComments = asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const { comments, total } = await CommentService.getPublicComments(blogId, { page, limit });
    return ApiResponse.paginated(res, 'Comments retrieved', comments, { page, limit, total });
  });

  static getAdminComments = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const { comments, total } = await CommentService.getAdminComments({ ...req.query, page, limit });
    return ApiResponse.paginated(res, 'Admin comment list retrieved', comments, { page, limit, total });
  });

  static updateStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const comment = await CommentService.updateCommentStatus(id, status);
    return ApiResponse.success(res, `Comment status updated to ${status}`, comment);
  });

  static deleteComment = asyncHandler(async (req, res) => {
    await CommentService.deleteComment(req.params.id);
    return ApiResponse.success(res, 'Comment deleted successfully');
  });
}