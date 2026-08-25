import mongoose from "mongoose";
import { Reaction } from "../models/Reaction.js";
import { Blog } from "../models/Blog.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { REACTION_TYPES } from "../constants/index.js";

export class ReactionService {
  static async addReaction(
    blogId,
    visitorId,
    reactionType
  ) {
    const blog = await Blog.findById(blogId).lean();

    if (!blog) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Target blog post does not exist"
      );
    }

    /*
     * If reaction is null, remove the visitor's
     * current reaction.
     */
    if (reactionType === null) {
      await Reaction.deleteOne({
        blog: blogId,
        visitorId,
      });

      return this.getBlogReactions(
        blogId,
        visitorId
      );
    }

    /*
     * Create OR replace the visitor's
     * existing reaction.
     *
     * IMPORTANT:
     * The filter does NOT contain reactionType.
     * Therefore one visitor can only have
     * one reaction per blog.
     */
    await Reaction.findOneAndUpdate(
      {
        blog: blogId,
        visitorId,
      },
      {
        $set: {
          blog: blogId,
          visitorId,
          reactionType,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return this.getBlogReactions(
      blogId,
      visitorId
    );
  }

  static async removeReaction(
    blogId,
    visitorId
  ) {
    await Reaction.deleteOne({
      blog: blogId,
      visitorId,
    });

    return this.getBlogReactions(
      blogId,
      visitorId
    );
  }

  static async getBlogReactions(
    blogId,
    visitorId = null
  ) {
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid blog ID"
      );
    }

    const pipeline = [
      {
        $match: {
          blog:
            new mongoose.Types.ObjectId(blogId),
        },
      },
      {
        $group: {
          _id: "$reactionType",
          count: {
            $sum: 1,
          },
        },
      },
    ];

    const aggregateResult =
      await Reaction.aggregate(
        pipeline
      );

    const counts =
      REACTION_TYPES.reduce(
        (acc, type) => {
          acc[type] = 0;
          return acc;
        },
        {}
      );

    let total = 0;

    aggregateResult.forEach((item) => {
      counts[item._id] =
        Number(item.count) || 0;

      total +=
        Number(item.count) || 0;
    });

    let userReactions = [];

    if (visitorId) {
      const visitorRecords =
        await Reaction.find({
          blog: blogId,
          visitorId,
        })
          .select("reactionType")
          .lean();

      userReactions =
        visitorRecords.map(
          (item) =>
            item.reactionType
        );
    }

    return {
      total,
      counts,
      userReactions,
    };
  }
}