import multer from "multer";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return cb(
      new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid image type. Only JPEG, PNG and WEBP images are allowed."
      ),
      false
    );
  }

  cb(null, true);
};

const uploader = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const uploadBlogImages =
  uploader.fields([
    {
      name: "featuredImage",
      maxCount: 1,
    },
    {
      name: "gallery",
      maxCount: 12,
    },
  ]);

export const uploadInitiativeImages =
  uploader.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "gallery",
      maxCount: 15,
    },
  ]);

export const uploadSingleImage =
  uploader.single("image");