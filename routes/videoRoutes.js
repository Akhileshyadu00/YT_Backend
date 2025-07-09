import express from "express";
import {
  videoUpload,
  getVideos,
  getVideoById,
  getChannelVideosByChannelId, // /api/videos/channel/:channelId
  getChannelVideosByUserId,    // /api/videos/user/:userId
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo
} from "../controllers/videoController.js";
import { authentication } from "../middleware/authentication.js";

const router = express.Router();

// Upload a new video (must be authenticated)
router.post("/", authentication, videoUpload);

// Get all videos (with optional search)
router.get("/", getVideos);

// Get a single video by its ID
router.get("/:id", getVideoById);

// Get all videos by channel ID
router.get("/channel/:channelId", getChannelVideosByChannelId);

// Get all videos by user ID
router.get("/user/:userId", getChannelVideosByUserId);

// Update a video (must be owner)
router.put("/:id", authentication, updateVideo);

// Delete a video (must be owner)
router.delete("/:id", authentication, deleteVideo);

// Like a video
router.post("/:id/like", authentication, likeVideo);

// Dislike a video
router.post("/:id/dislike", authentication, dislikeVideo);

export default router;
