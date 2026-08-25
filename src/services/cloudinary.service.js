import { cloudinary } from "../config/cloudinary.js";
import { logger } from "../config/logger.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

export class CloudinaryService {
  static async uploadBuffer(
    fileBuffer,
    folder,
    customFileName = null
  ) {
    if (!fileBuffer) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "No image file provided"
      );
    }

    return new Promise((resolve, reject) => {
      const options = {
        folder,
        resource_type: "image",
        format: "webp",
        quality: "auto:good",
      };

      if (customFileName) {
        options.public_id = customFileName;
      }

      const stream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            logger.error(
              `Cloudinary upload failed: ${error.message}`
            );

            return reject(
              new ApiError(
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                "Image upload failed"
              )
            );
          }

          resolve({
            secure_url: result.secure_url,
            url: result.secure_url,   // ye line add karo — frontend isi ko use kar raha hai
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            resource_type: result.resource_type,
          });
        }
      );

      stream.end(fileBuffer);
    });
  }

  static async uploadFiles(files = [], folder) {
    if (!files.length) {
      return [];
    }

    return Promise.all(
      files.map((file) =>
        this.uploadBuffer(file.buffer, folder)
      )
    );
  }

  static async deleteAsset(publicId) {
    if (!publicId) return;

    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      });

      logger.info(
        `Cloudinary asset deleted: ${publicId}`
      );
    } catch (error) {
      logger.error(
        `Cloudinary deletion failed [${publicId}]: ${error.message}`
      );
    }
  }

  static async deleteAssets(assets = []) {
    await Promise.all(
      assets
        .map((asset) => asset?.public_id)
        .filter(Boolean)
        .map((publicId) => this.deleteAsset(publicId))
    );
  }
}