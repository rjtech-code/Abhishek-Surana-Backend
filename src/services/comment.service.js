import { Comment } from "../models/Comment.js";
import { Blog } from "../models/Blog.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

export class CommentService {
  static async addComment(
    blogId,
    { visitorId, name, content }
  ) {
    const blog =
      await Blog.findById(blogId).lean();

    if (
      !blog ||
      blog.status !== "published"
    ) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Target published blog post not found"
      );
    }

    const comment =
      await Comment.create({
        blog: blogId,
        visitorId,
        name: name.trim(),
        content: content.trim(),

        // Show immediately after submission.
        status: "approved",
      });

    return {
      _id: comment._id,
      name: comment.name,
      content: comment.content,
      status: comment.status,
      createdAt: comment.createdAt,
    };
  }

  static async getPublicComments(
    blogId,
    {
      page = 1,
      limit = 20,
    }
  ) {
    const query = {
      blog: blogId,
      status: "approved",
    };

    const skip =
      (page - 1) * limit;

    const [
      comments,
      total,
    ] = await Promise.all([
      Comment.find(query)
        .select(
          "name content createdAt"
        )
        .sort("-createdAt")
        .skip(skip)
        .limit(limit)
        .lean(),

      Comment.countDocuments(query),
    ]);

    return {
      comments,
      total,
      page,
      limit,
    };
  }

  static async getAdminComments({
    page = 1,
    limit = 20,
    status,
    blogId,
  }) {
    const query = {};

    if (status) {
      query.status = status;
    }

    if (blogId) {
      query.blog = blogId;
    }

    const skip =
      (page - 1) * limit;

    const [
      comments,
      total,
    ] = await Promise.all([
      Comment.find(query)
        .populate(
          "blog",
          "title slug"
        )
        .sort("-createdAt")
        .skip(skip)
        .limit(limit)
        .lean(),

      Comment.countDocuments(query),
    ]);

    return {
      comments,
      total,
      page,
      limit,
    };
  }

  static async updateCommentStatus(
    commentId,
    status
  ) {
    const comment =
      await Comment.findByIdAndUpdate(
        commentId,
        { status },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!comment) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Comment not found"
      );
    }

    return comment;
  }

  static async deleteComment(
    commentId
  ) {
    const comment =
      await Comment.findByIdAndDelete(
        commentId
      );

    if (!comment) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Comment not found"
      );
    }

    return true;
  }
}