import { Request, Response } from "express";
import { FeedService } from "../services/feed.service";
import { sendResponse } from "../utils/sendResponse";
import { catchAsync } from "../core/catchAsync";
import { STATUS_CODES } from "../config";

const feedService = new FeedService();

export class FeedController {
  // ---- CREATE FEED POST ----
  create = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user._id.toString();
    const result = await feedService.create(userId, req.body, req.file);
    sendResponse(res, STATUS_CODES.CREATED, true, "Feed post created successfully", result);
  });


  // ---- GET ALL FEED POSTS ----
  getAll = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id?.toString();
    const result = await feedService.getAll(userId, req.query);
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Feeds retrieved successfully", result.feeds);
  });


  // ---- GET TRENDING HASHTAGS ----
  getTrendingHashtags = catchAsync(async (req: Request, res: Response) => {
    const result = await feedService.getTrendingHashtags();
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Trending hashtags retrieved successfully", result);
  });


  // ---- GET FEED POST BY AUTHOR ID ----
  getByAuthorId = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id?.toString();
    const authorId = req.params.authorId as string;
    const result = await feedService.getByAuthorId(userId, authorId, req.query);
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Feeds by author retrieved successfully", result.feeds);
  });


  // ---- GET FEED POST BY ID ----
  getById = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id?.toString();
    const id = req.params.id as string;
    const result = await feedService.getById(userId, id);
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Feed post retrieved successfully", result);
  });


  // ---- UPDATE FEED POST ----
  update = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user._id.toString();
    const id = req.params.id as string;
    const result = await feedService.update(userId, id, req.body, req.file);
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Feed post updated successfully", result);
  });


  // ---- DELETE FEED POST ----
  delete = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user._id.toString();
    const id = req.params.id as string;
    await feedService.delete(userId, id);
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Feed post deleted successfully");
  });


  // ---- TOGGLE LIKE ----
  toggleLike = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user._id.toString();
    const id = req.params.id as string;
    const result = await feedService.toggleLike(userId, id);
    sendResponse(res, STATUS_CODES.SUCCESS, true, result.liked ? "Post liked" : "Post unliked", result);
  });


  // ---- ADD COMMENT ----
  addComment = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user._id.toString();
    const id = req.params.id as string;
    const result = await feedService.addComment(userId, id, req.body.content);
    sendResponse(res, STATUS_CODES.CREATED, true, "Comment added successfully", result);
  });


  // ---- GET COMMENTS ----
  getComments = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await feedService.getComments(id);
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Comments retrieved successfully", result);
  });

  // ---- DELETE COMMENT ----
  deleteComment = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user._id.toString();
    const commentId = req.params.commentId as string;
    const result = await feedService.deleteComment(userId, commentId);
    sendResponse(res, STATUS_CODES.SUCCESS, true, "Comment deleted successfully", result);
  });
}
