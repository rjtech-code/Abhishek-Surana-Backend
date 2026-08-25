import { ReactionService } from "../services/reaction.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export class ReactionController {
  static getReactions =
    asyncHandler(async (req, res) => {
      const { blogId } = req.params;
      const { visitorId } = req.query;

      const stats =
        await ReactionService.getBlogReactions(
          blogId,
          visitorId || null
        );

      return ApiResponse.success(
        res,
        "Reaction statistics fetched",
        stats
      );
    });

  static addReaction =
    asyncHandler(async (req, res) => {
      const { blogId } = req.params;
      const {
        visitorId,
        reactionType,
      } = req.body;

      const updatedStats =
        await ReactionService.addReaction(
          blogId,
          visitorId,
          reactionType
        );

      return ApiResponse.success(
        res,
        "Reaction submitted",
        updatedStats
      );
    });

  static removeReaction =
    asyncHandler(async (req, res) => {
      const { blogId } = req.params;
      const { visitorId } = req.body;

      const updatedStats =
        await ReactionService.removeReaction(
          blogId,
          visitorId
        );

      return ApiResponse.success(
        res,
        "Reaction removed",
        updatedStats
      );
    });
}