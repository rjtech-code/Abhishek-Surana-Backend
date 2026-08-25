import { BlogService } from "../services/blog.service.js";
import { Blog } from "../models/Blog.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

const parseMultipartValue = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return value;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
};

export class BlogController {
  
static createBlog = asyncHandler(async (req, res) => {
  const data = {
    ...req.body,
    tags: parseMultipartValue(req.body.tags),
    featured:
      req.body.featured === true ||
      req.body.featured === "true",
  };

  const files = {
    featuredImage:
      req.files?.featuredImage?.[0] || null,

    gallery:
      req.files?.gallery || [],
  };

  const blog =
    await BlogService.createBlog(data, files);

  return ApiResponse.success(
    res,
    "Blog post created successfully",
    blog,
    HTTP_STATUS.CREATED
  );
});

static updateBlog = asyncHandler(async (req, res) => {
  const data = {
    ...req.body,
    tags: parseMultipartValue(req.body.tags),
  };

  if (req.body.featured !== undefined) {
    data.featured =
      req.body.featured === true ||
      req.body.featured === "true";
  }

  const files = {
    featuredImage:
      req.files?.featuredImage?.[0] || null,

    gallery:
      req.files?.gallery || [],
  };

  const blog =
    await BlogService.updateBlog(
      req.params.id,
      data,
      files
    );

  return ApiResponse.success(
    res,
    "Blog post updated successfully",
    blog
  );
});

  static deleteBlog = asyncHandler(async (req, res) => {
    await BlogService.deleteBlog(req.params.id);

    return ApiResponse.success(
      res,
      "Blog post and related assets deleted successfully"
    );
  });

  static getAdminBlogs = asyncHandler(async (req, res) => {
    const page = Math.max(
      parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      50
    );

    const { blogs, total } =
      await BlogService.getAdminBlogs({
        ...req.query,
        page,
        limit,
      });

    return ApiResponse.paginated(
      res,
      "Admin blogs retrieved",
      blogs,
      {
        page,
        limit,
        total,
      }
    );
  });

  static getAdminBlogById = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id).lean();

    if (!blog) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Blog post not found"
      );
    }

    return ApiResponse.success(
      res,
      "Blog post retrieved",
      blog
    );
  });

  static togglePublish = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const publish =
      req.body.publish === true ||
      req.body.publish === "true";

    const blog = await BlogService.updateBlog(
      id,
      {
        status: publish ? "published" : "draft",
      },
      {}
    );

    return ApiResponse.success(
      res,
      `Blog marked as ${
        publish ? "published" : "draft"
      }`,
      blog
    );
  });

  static toggleFeatured = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const featured =
      req.body.featured === true ||
      req.body.featured === "true";

    const blog = await BlogService.updateBlog(
      id,
      {
        featured,
      },
      {}
    );

    return ApiResponse.success(
      res,
      "Blog featured status updated",
      blog
    );
  });

  static getPublicBlogs = asyncHandler(async (req, res) => {
    const page = Math.max(
      parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      50
    );

    const { blogs, total } =
      await BlogService.getPublicBlogs({
        ...req.query,
        page,
        limit,
      });

    return ApiResponse.paginated(
      res,
      "Blogs fetched successfully",
      blogs,
      {
        page,
        limit,
        total,
      }
    );
  });

  static getPublicBlogBySlug = asyncHandler(async (req, res) => {
    const blog =
      await BlogService.getPublicBlogBySlug(
        req.params.slug
      );

    return ApiResponse.success(
      res,
      "Blog article details retrieved",
      blog
    );
  });

  static getFeaturedBlogs = asyncHandler(async (req, res) => {
    const { blogs } =
      await BlogService.getPublicBlogs({
        featured: true,
        limit: 3,
      });

    return ApiResponse.success(
      res,
      "Featured blogs fetched",
      blogs
    );
  });

  static getCategories = asyncHandler(async (req, res) => {
    const categories =
      await BlogService.getCategories();

    return ApiResponse.success(
      res,
      "Blog categories fetched",
      categories
    );
  });

  static getTags = asyncHandler(async (req, res) => {
    const tags = await BlogService.getTags();

    return ApiResponse.success(
      res,
      "Blog tags fetched",
      tags
    );
  });
}