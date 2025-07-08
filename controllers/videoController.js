import Video from "../models/video.js";
import mongoose from "mongoose";

export async function videoUpload(req, res) {
  try {
    const { title, description, thumbnail, videoLink, category } = req.body;

    // Basic validation
    if (!title || !description || !thumbnail || !videoLink || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get user ID from the authenticated request
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    // Create video
    const newVideo = new Video({
      user: userId,
      title,
      description,
      thumbnail,
      videoLink,
      category,
    });

    await newVideo.save();

    return res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo,
    });
  } catch (error) {
    console.error("Video upload error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getVideos(req, res) {
  try {
    const videos = await Video.find().populate(
      "user",
      "userName channelName profilePic"
    ); // populate user info
    res.status(200).json({ videos });
  } catch (err) {
    console.error("Get videos error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET VIDEO BY ID
export async function getVideoById(req, res) {
  try {
    const videoId = req.params.id;

    const video = await Video.findById(videoId).populate(
      "user",
      "userName channelName profilePic"
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ video });
  } catch (err) {
    console.error("Get video by ID error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET ALL VIDEOS BY USER ID
export async function getVideosByUser(req, res) {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const videos = await Video.find({ user: userId })
      .populate("user", "userName channelName profilePic createdAt about")
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({ videos });
  } catch (err) {
    console.error("Get videos by user error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// UPDATE VIDEO
export async function updateVideo(req, res) {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;
    const updates = req.body;

    // Find video and check ownership
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this video" });
    }

    // Update video fields
    const updatedVideo = await Video.findByIdAndUpdate(videoId, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Video updated successfully",
      video: updatedVideo,
    });
  } catch (err) {
    console.error("Update video error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// DELETE VIDEO
export async function deleteVideo(req, res) {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this video" });
    }

    await video.deleteOne();

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("Delete video error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

