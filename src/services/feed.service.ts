import { FeedModel } from "../models/feed.model";
import { CommentModel } from "../models/comment.model";
import { LikeModel } from "../models/like.model";
import { IFeed } from "../interfaces/masterInterfaces/feed.interface";
import { NotFoundError, UnauthorizedError } from "../core/errors";
import { deleteFileIfExists } from "../utils/file.utils";

export class FeedService {

  // ---- HELPER FUNCTIONS ----
  private sanitizeHashtags(hashtags?: string[]): string[] {
    if (!hashtags || !Array.isArray(hashtags) || hashtags.length === 0) {
      return hashtags || [];
    }

    if (
      hashtags.length === 1 &&
      typeof hashtags[0] === "string" &&
      hashtags[0].trim().startsWith("[")
    ) {
      try {
        const parsed = JSON.parse(hashtags[0].trim());
        if (Array.isArray(parsed)) {
          return parsed.map((v) => String(v).trim());
        }
      } catch (e) {
      }
    }
    return hashtags.map((v) => String(v).trim());
  }


  // ---- CREATE FEED POST ----
  create = async (userId: string, data: Partial<IFeed>, file?: Express.Multer.File) => {
    if (file) {
      data.media = `/uploads/media/${file.filename}`;
    }

    data.hashtags = this.sanitizeHashtags(data.hashtags);

    const feed = await FeedModel.create({ ...data, authorId: userId });
    return feed;
  };


  // ---- GET ALL FEED POSTS ----
  getAll = async (query: any) => {
    const { page = 1, limit = 10, search, sortBy } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = { isDeleted: false };
    if (search) {
      filter.$or = [
        { content: { $regex: search, $options: "i" } },
        { hashtags: { $regex: search, $options: "i" } },
      ];
    }

    // Determine sort order
    let sort: any = { createdAt: -1 };
    if (sortBy === "likes") sort = { likesCount: -1 };
    else if (sortBy === "views") sort = { viewsCount: -1 };
    else if (sortBy === "comments") sort = { commentsCount: -1 };

    const feeds = await FeedModel.find(filter)
      .populate({
        path: "authorId",
        select: "firstName lastName avatar roleId universityId",
        populate: [
          { path: "roleId", select: "name" },
          { path: "universityId", select: "name" },
        ],
      })
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const sanitizedFeeds = feeds.map((feed) => {
      feed.hashtags = this.sanitizeHashtags(feed.hashtags);
      return feed;
    });

    const total = await FeedModel.countDocuments(filter);

    return {
      feeds: sanitizedFeeds,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  };


  // ---- GET FEED POST BY AUTHOR ID ----
  getByAuthorId = async (authorId: string, query: any) => {
    const { page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = { authorId, isDeleted: false };

    const feeds = await FeedModel.find(filter)
      .populate({
        path: "authorId",
        select: "firstName lastName avatar roleId universityId",
        populate: [
          { path: "roleId", select: "name" },
          { path: "universityId", select: "name" },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await FeedModel.countDocuments(filter);

    const sanitizedFeeds = feeds.map((feed) => {
      feed.hashtags = this.sanitizeHashtags(feed.hashtags);
      return feed;
    });

    return {
      feeds: sanitizedFeeds,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  };


  // ---- GET TRENDING HASHTAGS ----
  getTrendingHashtags = async () => {
    // Get top 50 posts by engagement
    const topPosts = await FeedModel.find({ isDeleted: false })
      .sort({ viewsCount: -1, likesCount: -1 })
      .limit(50)
      .select("hashtags");

    const hashtagCounts: Record<string, number> = {};

    topPosts.forEach((post) => {
      const tags = this.sanitizeHashtags(post.hashtags);
      tags.forEach((tag) => {
        if (tag) {
          hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
        }
      });
    });

    // Sort by frequency and take top 10
    const trendingTags = Object.entries(hashtagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);

    return trendingTags;
  };


  // ---- GET FEED POST BY ID ----
  getById = async (id: string) => {
    const feed = await FeedModel.findOne({
      _id: id,
      isDeleted: false,
    }).populate({
      path: "authorId",
      select: "firstName lastName avatar roleId universityId",
      populate: [
        { path: "roleId", select: "name" },
        { path: "universityId", select: "name" },
      ],
    });
    if (!feed) throw new NotFoundError("Feed post not found");

    feed.hashtags = this.sanitizeHashtags(feed.hashtags);

    feed.viewsCount += 1;
    await feed.save();

    return feed;
  };


  // ---- UPDATE FEED POST ----
  update = async (userId: string, id: string, data: Partial<IFeed>, file?: Express.Multer.File) => {
    const feed = await FeedModel.findOne({ _id: id, isDeleted: false });
    if (!feed) throw new NotFoundError("Feed post not found");

    if (feed.authorId.toString() !== userId) {
      throw new UnauthorizedError("You are not authorized to update this post");
    }

    if (file) {
      if (feed.media) {
        deleteFileIfExists(feed.media);
      }
      data.media = `/uploads/media/${file.filename}`;
    }

    if (data.hashtags) {
      data.hashtags = this.sanitizeHashtags(data.hashtags);
    }

    Object.assign(feed, data);

    feed.hashtags = this.sanitizeHashtags(feed.hashtags);

    await feed.save();
    return feed;
  };


  // ---- DELETE FEED POST ----
  delete = async (userId: string, id: string) => {
    const feed = await FeedModel.findOne({ _id: id, isDeleted: false });
    if (!feed) throw new NotFoundError("Feed post not found");

    if (feed.authorId.toString() !== userId) {
      throw new UnauthorizedError("You are not authorized to delete this post");
    }

    if (feed.media) {
      deleteFileIfExists(feed.media);
    }

    feed.isDeleted = true;
    await feed.save();
    return feed;
  };


  // ---- TOGGLE LIKE ----
  toggleLike = async (userId: string, feedId: string) => {
    const feed = await FeedModel.findOne({ _id: feedId, isDeleted: false });
    if (!feed) throw new NotFoundError("Feed post not found");

    const existingLike = await LikeModel.findOne({ feedId, authorId: userId });

    if (existingLike) {
      await LikeModel.deleteOne({ _id: existingLike._id });
      feed.likesCount = Math.max(0, feed.likesCount - 1);
      await feed.save();
      return { liked: false, likesCount: feed.likesCount };
    } else {
      await LikeModel.create({ feedId, authorId: userId });
      feed.likesCount += 1;
      await feed.save();
      return { liked: true, likesCount: feed.likesCount };
    }
  };


  // ---- ADD COMMENT ----
  addComment = async (userId: string, feedId: string, content: string) => {
    const feed = await FeedModel.findOne({ _id: feedId, isDeleted: false });
    if (!feed) throw new NotFoundError("Feed post not found");

    const comment = await CommentModel.create({
      feedId,
      authorId: userId,
      content,
    });

    feed.commentsCount += 1;
    await feed.save();

    return comment;
  };


  // ---- GET COMMENTS ----
  getComments = async (feedId: string) => {
    const comments = await CommentModel.find({ feedId, isDeleted: false })
      .populate("authorId", "firstName lastName avatar")
      .sort({ createdAt: -1 });
    return comments;
  };

  deleteComment = async (userId: string, commentId: string) => {
    const comment = await CommentModel.findOne({
      _id: commentId,
      isDeleted: false
    });
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }
    // Fetch post
    const feed = await FeedModel.findById(comment.feedId);
    if (!feed) {
      throw new NotFoundError("Feed post not found");
    }
    // Check authorization
    const isCommentAuthor = comment.authorId.toString() === userId;
    const isPostOwner = feed.authorId.toString() === userId;
    if (!isCommentAuthor && !isPostOwner) {
      throw new UnauthorizedError(
        "You are not authorized to delete this comment"
      );
    }
    comment.isDeleted = true;
    await comment.save();
    return comment;
  }
}
