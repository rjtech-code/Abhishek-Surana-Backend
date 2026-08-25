import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (!result.success) {
        console.error(
          "========== VALIDATION ERROR =========="
        );

        console.error(
          JSON.stringify(
            result.error.flatten(),
            null,
            2
          )
        );

        console.error(
          "REQ.BODY:",
          req.body
        );

        console.error(
          "REQ.FILES:",
          req.files
            ? Object.keys(req.files)
            : "none"
        );

        console.error(
          "======================================"
        );

        throw new ApiError(
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Validation error occurred",
          result.error.flatten()
        );
      }

      req.body = result.data.body;

      next();
    } catch (error) {
      next(error);
    }
  };
};