import { Blog } from "../models/Blog.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { generateSlug } from "../utils/slugify.js";
import { CloudinaryService } from "./cloudinary.service.js";

export class BlogService {
  /* =========================================
     CREATE
  ========================================= */

  static async createBlog(data, files = {}) {
    if (!data?.title) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Blog title is required"
      );
    }

    const featuredImageFile =
      files?.featuredImage || null;

    if (!featuredImageFile) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Featured image is required"
      );
    }

    /*
     * Generate unique slug
     */
    let slug = generateSlug(data.title);

    let existing = await Blog.findOne({ slug });

    let suffix = 1;

    while (existing) {
      slug = `${generateSlug(data.title)}-${suffix}`;

      existing = await Blog.findOne({ slug });

      suffix++;
    }

    /*
     * Upload featured image FIRST
     */
    const uploadedFeaturedImage =
      await CloudinaryService.uploadBuffer(
        featuredImageFile.buffer,
        "dm-churu/blogs"
      );

    /*
     * Upload gallery images
     */
    const galleryFiles =
      Array.isArray(files?.gallery)
        ? files.gallery
        : [];

    const uploadedGallery =
      galleryFiles.length > 0
        ? await Promise.all(
            galleryFiles.map((file) =>
              CloudinaryService.uploadBuffer(
                file.buffer,
                "dm-churu/blogs"
              )
            )
          )
        : [];

    try {
      /*
       * IMPORTANT:
       * Only now create MongoDB document.
       */

      const blog = await Blog.create({
        title: data.title,
        slug,

        excerpt: data.excerpt,
        content: data.content,

        category: data.category,

        tags: Array.isArray(data.tags)
          ? data.tags
          : [],

        author: data.author || undefined,

        status:
          data.status === "published"
            ? "published"
            : "draft",

        featured:
          data.featured === true ||
          data.featured === "true",

        featuredImage:
          uploadedFeaturedImage,

        gallery:
          uploadedGallery,

        seo: data.seo || undefined,
      });

      return blog;
    } catch (error) {
      /*
       * DB failed after Cloudinary upload.
       * Clean uploaded assets.
       */

      await CloudinaryService.deleteAsset(
        uploadedFeaturedImage?.public_id
      );

      if (uploadedGallery.length > 0) {
        await Promise.allSettled(
          uploadedGallery.map((image) =>
            CloudinaryService.deleteAsset(
              image?.public_id
            )
          )
        );
      }

      if (error?.name === "ValidationError") {
        console.error(
          "BLOG DATABASE VALIDATION ERROR:",
          error.errors
        );

        throw new ApiError(
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          Object.values(error.errors)
            .map((item) => item.message)
            .join("; ")
        );
      }

      throw error;
    }
  }

  /* =========================================
     UPDATE
  ========================================= */

  static async updateBlog(
    id,
    data,
    files = {}
  ) {
    const blog = await Blog.findById(id);

    if (!blog) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Blog post not found"
      );
    }

    let slug = blog.slug;

    /*
     * Regenerate slug if title changed
     */
    if (
      data.title &&
      data.title.trim() !== blog.title
    ) {
      slug = generateSlug(data.title);

      let existing = await Blog.findOne({
        slug,
        _id: { $ne: id },
      });

      let suffix = 1;

      while (existing) {
        slug = `${generateSlug(data.title)}-${suffix}`;

        existing = await Blog.findOne({
          slug,
          _id: { $ne: id },
        });

        suffix++;
      }
    }

    let newFeaturedImage = null;
    let newGalleryImages = [];

    /*
     * New cover image
     */
    if (files?.featuredImage) {
      newFeaturedImage =
        await CloudinaryService.uploadBuffer(
          files.featuredImage.buffer,
          "dm-churu/blogs"
        );
    }

    /*
     * New gallery
     */
    if (
      Array.isArray(files?.gallery) &&
      files.gallery.length > 0
    ) {
      newGalleryImages =
        await Promise.all(
          files.gallery.map((file) =>
            CloudinaryService.uploadBuffer(
              file.buffer,
              "dm-churu/blogs"
            )
          )
        );
    }

    try {
      const updateData = {
        ...data,
        slug,
      };

      /*
       * Don't accidentally save multipart
       * helper values.
       */
      delete updateData.featuredImage;
      delete updateData.gallery;

      /*
       * Replace cover only when new file exists.
       */
      if (newFeaturedImage) {
        updateData.featuredImage =
          newFeaturedImage;
      }

      /*
       * Append new gallery images.
       */
      if (newGalleryImages.length > 0) {
        updateData.gallery = [
          ...(blog.gallery || []),
          ...newGalleryImages,
        ];
      }

      const updated =
        await Blog.findByIdAndUpdate(
          id,
          {
            $set: updateData,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      /*
       * Delete old cover AFTER successful DB update.
       */
      if (
        newFeaturedImage &&
        blog.featuredImage?.public_id
      ) {
        await CloudinaryService.deleteAsset(
          blog.featuredImage.public_id
        );
      }

      return updated;
    } catch (error) {
      /*
       * DB update failed.
       * Delete newly uploaded assets.
       */

      if (newFeaturedImage?.public_id) {
        await CloudinaryService.deleteAsset(
          newFeaturedImage.public_id
        );
      }

      if (newGalleryImages.length > 0) {
        await Promise.allSettled(
          newGalleryImages.map((image) =>
            CloudinaryService.deleteAsset(
              image?.public_id
            )
          )
        );
      }

      if (error?.name === "ValidationError") {
        console.error(
          "BLOG UPDATE DATABASE VALIDATION ERROR:",
          error.errors
        );

        throw new ApiError(
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          Object.values(error.errors)
            .map((item) => item.message)
            .join("; ")
        );
      }

      throw error;
    }
  }

  /* =========================================
     DELETE
  ========================================= */

  static async deleteBlog(id) {
    const blog = await Blog.findById(id);

    if (!blog) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Blog post not found"
      );
    }

    /*
     * Delete cover
     */
    if (blog.featuredImage?.public_id) {
      await CloudinaryService.deleteAsset(
        blog.featuredImage.public_id
      );
    }

    /*
     * Delete gallery
     */
    if (
      Array.isArray(blog.gallery) &&
      blog.gallery.length > 0
    ) {
      await Promise.allSettled(
        blog.gallery.map((image) =>
          CloudinaryService.deleteAsset(
            image?.public_id
          )
        )
      );
    }

    await Blog.findByIdAndDelete(id);

    return true;
  }

  /* =========================================
     ADMIN LIST
  ========================================= */

  static async getAdminBlogs({
    page = 1,
    limit = 10,
    search,
    category,
    status,
    featured,
    sort = "-createdAt",
  }) {
    const query = {};

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          excerpt: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    }

    if (featured !== undefined) {
      query.featured =
        featured === true ||
        featured === "true";
    }

    const skip = (page - 1) * limit;

    const [blogs, total] =
      await Promise.all([
        Blog.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),

        Blog.countDocuments(query),
      ]);

    return {
      blogs,
      total,
      page,
      limit,
    };
  }

  /* =========================================
     PUBLIC LIST
  ========================================= */

  static async getPublicBlogs({
    page = 1,
    limit = 10,
    search,
    category,
    featured,
    sort = "-publishedAt",
  }) {
    const query = {
      status: "published",
    };

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          excerpt: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (featured !== undefined) {
      query.featured =
        featured === true ||
        featured === "true";
    }

    const skip = (page - 1) * limit;

    const [blogs, total] =
      await Promise.all([
        Blog.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),

        Blog.countDocuments(query),
      ]);

    return {
      blogs,
      total,
      page,
      limit,
    };
  }

  /* =========================================
     PUBLIC SINGLE
  ========================================= */

  static async getPublicBlogBySlug(slug) {
    const blog = await Blog.findOne({
      slug,
      status: "published",
    }).lean();

    if (!blog) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Blog post not found"
      );
    }

    return blog;
  }

  /* =========================================
     CATEGORIES
  ========================================= */

  static async getCategories() {
    return Blog.distinct("category", {
      status: "published",
    });
  }

  /* =========================================
     TAGS
  ========================================= */

  static async getTags() {
    const tags = await Blog.distinct("tags", {
      status: "published",
    });

    return tags.filter(Boolean);
  }
}