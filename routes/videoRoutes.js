import express from "express";
import {
  videoUpload,
  getVideos,
  getVideoById,
  getChannelVideos, // <--- for /api/videos/:id/channel
  updateVideo,
  deleteVideo,
} from "../controllers/videoController.js";

const router = express.Router();

router.post("/upload", videoUpload);
router.get("/", getVideos);
router.get("/:id", getVideoById);
router.get("/:id/channel", getChannelVideos); // <--- this route!
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);

export default router;
