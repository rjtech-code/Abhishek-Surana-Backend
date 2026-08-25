import { Initiative } from "../models/Initiative.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { generateSlug } from "../utils/slugify.js";
import { CloudinaryService } from "./cloudinary.service.js";

const INITIATIVE_FOLDER = "DM-Churu/initiatives";

const createUniqueSlug = async (title, excludeId = null) => {
  const baseSlug = generateSlug(title);

  let slug = baseSlug;
  let suffix = 1;

  const query = { slug };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  while (await Initiative.exists(query)) {
    slug = `${baseSlug}-${suffix++}`;
    query.slug = slug;
  }

  return slug;
};

export class InitiativeService {
  
static async createInitiative(data, files = {}) {
  const uploadedAssets = [];

  try {
    if (!files.coverImage) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Cover image is required"
      );
    }

    const slug = await createUniqueSlug(data.title);

    let coverImage = null;
    let gallery = [];

    /* =========================
       COVER IMAGE
    ========================= */

    if (files.coverImage) {
      coverImage = await CloudinaryService.uploadBuffer(
        files.coverImage.buffer,
        `${INITIATIVE_FOLDER}/covers`
      );

      uploadedAssets.push(coverImage);
    }

    /* =========================
       GALLERY
    ========================= */

    if (files.gallery?.length) {
      const uploadedGallery =
        await CloudinaryService.uploadFiles(
          files.gallery,
          `${INITIATIVE_FOLDER}/gallery`
        );

      gallery = uploadedGallery;

      uploadedAssets.push(...uploadedGallery);
    }

    /* =========================
       DATABASE
    ========================= */

    const initiative = await Initiative.create({
      ...data,
      slug,
      coverImage,
      gallery,
    });

    return initiative;
  } catch (error) {
    await CloudinaryService.deleteAssets(
      uploadedAssets
    );

    throw error;
  }
}

  static async updateInitiative(
    id,
    data,
    files = {}
  ) {
    const initiative =
      await Initiative.findById(id);

    if (!initiative) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Initiative not found"
      );
    }

    const uploadedAssets = [];

    try {
      /* =========================
         SLUG
      ========================= */

      if (
        data.title &&
        data.title !== initiative.title
      ) {
        data.slug = await createUniqueSlug(
          data.title,
          id
        );
      }

      /* =========================
         COVER IMAGE REPLACEMENT
      ========================= */

      if (files.coverImage) {
        const newCover =
          await CloudinaryService.uploadBuffer(
            files.coverImage.buffer,
            `${INITIATIVE_FOLDER}/covers`
          );

        uploadedAssets.push(newCover);

        data.coverImage = newCover;
      }

      /* =========================
         ADD GALLERY IMAGES
      ========================= */

      if (files.gallery?.length) {
        const newGallery =
          await CloudinaryService.uploadFiles(
            files.gallery,
            `${INITIATIVE_FOLDER}/gallery`
          );

        uploadedAssets.push(...newGallery);

        data.gallery = [
          ...(initiative.gallery || []),
          ...newGallery,
        ];
      }

      /* =========================
         DATABASE UPDATE
      ========================= */

      const updated =
        await Initiative.findByIdAndUpdate(
          id,
          {
            $set: data,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      /* =========================
         DELETE OLD COVER
      ========================= */

      if (
        files.coverImage &&
        initiative.coverImage?.public_id
      ) {
        await CloudinaryService.deleteAsset(
          initiative.coverImage.public_id
        );
      }

      return updated;
    } catch (error) {
      /*
       * Remove newly uploaded assets when
       * database update fails.
       */
      await CloudinaryService.deleteAssets(
        uploadedAssets
      );

      throw error;
    }
  }

  static async deleteInitiative(id) {
    const initiative =
      await Initiative.findById(id);

    if (!initiative) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Initiative not found"
      );
    }

    if (initiative.coverImage?.public_id) {
      await CloudinaryService.deleteAsset(
        initiative.coverImage.public_id
      );
    }

    if (initiative.gallery?.length) {
      await CloudinaryService.deleteAssets(
        initiative.gallery
      );
    }

    await Initiative.findByIdAndDelete(id);

    return true;
  }

  static async getPublicInitiatives({
    page = 1,
    limit = 10,
    search,
    category,
    status,
    featured,
    sort = "order -createdAt",
  }) {
    const query = {
      published: true,
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
          summary: {
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
        featured === "true" ||
        featured === true;
    }

    const skip = (page - 1) * limit;

    const [initiatives, total] =
      await Promise.all([
        Initiative.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),

        Initiative.countDocuments(query),
      ]);

    return {
      initiatives,
      total,
      page,
      limit,
    };
  }

  static async getPublicInitiativeBySlug(
    slug
  ) {
    const initiative =
      await Initiative.findOne({
        slug,
        published: true,
      }).lean();

    if (!initiative) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Initiative not found"
      );
    }

    return initiative;
  }

  static async getAdminInitiatives({
    page = 1,
    limit = 10,
    search,
    category,
    published,
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
          summary: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (published !== undefined) {
      query.published =
        published === "true" ||
        published === true;
    }

    const skip = (page - 1) * limit;

    const [initiatives, total] =
      await Promise.all([
        Initiative.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),

        Initiative.countDocuments(query),
      ]);

    return {
      initiatives,
      total,
      page,
      limit,
    };
  }

  static async getCategories() {
    return Initiative.distinct(
      "category",
      {
        published: true,
      }
    );
  }
}