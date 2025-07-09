import express from "express";
import {
  videoUpload,
  getVideos,
  getVideoById,
  getChannelVideos, // <--- for /api/videos/:id/channel
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo
} from "../controllers/videoController.js";

import { authentication } from "../middleware/authentication.js";

const router = express.Router();

router.post("/upload",authentication, videoUpload);
router.get("/", getVideos);
router.get("/:id", getVideoById);
//router.get("/:id/channel",authentication, getChannelVideos); // <--- user Routes
router.put("/:id", authentication,updateVideo);
router.delete("/:id",authentication ,deleteVideo);

router.post('/:id/like',authentication, likeVideo);
router.post('/:id/dislike',authentication, dislikeVideo);
router.get("/:id/channel",authentication, getChannelVideos); 

export default router;
