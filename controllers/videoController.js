import Channel from "../models/channel.js";
import Video from "../models/video.js";
import mongoose from "mongoose";

// UPLOAD VIDEO (links video to channel)
// export async function videoUpload(req, res) {
//   try {
//     const { title, description, thumbnail, videoLink, category } = req.body;
//     const userId = req.user?.id;

//     if (!title || !description || !thumbnail || !videoLink || !category) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized: No user found" });
//     }

//     // Find the channel for this user
//     const channel = await Channel.findOne({ owner: userId });
//     if (!channel) {
//       return res.status(404).json({ message: "Channel not found for user." });
//     }

//     // Create the new video and link to channel
//     const newVideo = new Video({
//       user: userId,
//       channel: channel._id,
//       title,
//       description,
//       thumbnail,
//       videoLink,
//       category,
//     });

//     await newVideo.save();

//     // Add video to channel's videos array
//     channel.videos.push(newVideo._id);
//     await channel.save();

//     return res.status(201).json({
//       message: "Video uploaded successfully",
//       video: newVideo,
//     });
//   } catch (error) {
//     console.error("Video upload error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

export async function videoUpload(req, res) {
  try {
    const { title, description, thumbnail, videoLink, category, channel: channelId } = req.body;
    const userId = req.user?.id;

    if (!title || !description || !thumbnail || !videoLink || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    // Use channel from body if provided, else find by user
    let channel;
    if (channelId) {
      channel = await Channel.findById(channelId);
      if (!channel) {
        return res.status(404).json({ message: "Channel not found." });
      }
      // Optional: Check if user owns the channel
      if (channel.owner.toString() !== userId) {
        return res.status(403).json({ message: "You do not own this channel." });
      }
    } else {
      channel = await Channel.findOne({ owner: userId });
      if (!channel) {
        return res.status(404).json({ message: "Channel not found for user." });
      }
    }

    // Create the new video and link to channel
    const newVideo = new Video({
      user: userId,
      channel: channel._id,
      title,
      description,
      thumbnail,
      videoLink,
      category,
    });

    await newVideo.save();

    // Add video to channel's videos array
    channel.videos.push(newVideo._id);
    await channel.save();

    return res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo,
    });
  } catch (error) {
    console.error("Video upload error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// GET ALL VIDEOS (with optional search)
export async function getVideos(req, res) {
  try {
    const search = req.query.search?.toLowerCase() || '';
    let videos = await Video.find()
      .populate("user", "userName channelName profilePic")
      .sort({ createdAt: -1 });

    if (search) {
      videos = videos.filter(video =>
        video.title.toLowerCase().includes(search)
      );
    }

    res.status(200).json({ videos });
  } catch (err) {
    console.error("Get videos error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET ALL VIDEOS BY CHANNEL ID
export async function getChannelVideosByChannelId(req, res) {
  const { id } = req.params; // channel id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid channel ID format" });
  }

  try {
    const channel = await Channel.findById(id).populate({
      path: "videos",
      populate: { path: "user", select: "userName channelName profilePic" }
    });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    res.status(200).json({ videos: channel.videos });
  } catch (err) {
    console.error("Get channel videos error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET ALL VIDEOS BY USER ID
export async function getChannelVideosByUserId(req, res) {
  const { userId } = req.params; // userId, not id!

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const videos = await Video.find({ user: userId })
      .populate("user", "userName channelName profilePic createdAt about")
      .sort({ createdAt: -1 });

    res.status(200).json({ videos });
  } catch (err) {
    console.error("Get user videos error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// GET VIDEO BY ID
export async function getVideoById(req, res) {
  try {
    const videoId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID format" });
    }

    const video = await Video.findById(videoId)
      .populate("user", "userName  profilePic")
      .populate("channel", "channelName subscribers");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ video });
  } catch (err) {
    console.error("Get video by ID error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// UPDATE VIDEO
export async function updateVideo(req, res) {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID format" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.user.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this video" });
    }

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

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID format" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.user.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this video" });
    }

    // Remove video from channel.videos array
    if (video.channel) {
      await Channel.findByIdAndUpdate(video.channel, {
        $pull: { videos: video._id }
      });
    }

    await video.deleteOne();

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("Delete video error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// LIKE VIDEO (with user tracking)
export async function likeVideo(req, res) {
  try {
    const video = await Video.findById(req.params.id);
    const userId = req.user?.id;

    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Prevent duplicate like
    if (video.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You already liked this video" });
    }

    // Add like
    video.like += 1;
    video.likedBy.push(userId);

    // If previously disliked, remove dislike
    const dislikeIndex = video.dislikedBy.indexOf(userId);
    if (dislikeIndex !== -1) {
      video.dislike = Math.max(video.dislike - 1, 0);
      video.dislikedBy.splice(dislikeIndex, 1);
    }

    await video.save();
    res.status(200).json({ like: video.like, dislike: video.dislike });
  } catch (err) {
    console.error("Like video error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// DISLIKE VIDEO (with user tracking)
export async function dislikeVideo(req, res) {
  try {
    const video = await Video.findById(req.params.id);
    const userId = req.user?.id;

    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Prevent duplicate dislike
    if (video.dislikedBy.includes(userId)) {
      return res.status(400).json({ message: "You already disliked this video" });
    }

    // Add dislike
    video.dislike += 1;
    video.dislikedBy.push(userId);

    // If previously liked, remove like
    const likeIndex = video.likedBy.indexOf(userId);
    if (likeIndex !== -1) {
      video.like = Math.max(video.like - 1, 0);
      video.likedBy.splice(likeIndex, 1);
    }

    await video.save();
    res.status(200).json({ like: video.like, dislike: video.dislike });
  } catch (err) {
    console.error("Dislike video error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
