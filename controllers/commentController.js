
import Comment from '../models/comment.js';
import Video from '../models/video.js';

// ADD COMMENT TO A VIDEO
// export async function addComment(req, res) {
//   try {
//     const { videoId, message } = req.body;

//     // Validate input
//     if (!videoId || !message) {
//       return res.status(400).json({ message: 'Video ID and comment text are required' });
//     }

//     // Check if video exists
//     const video = await Video.findById(videoId);
//     if (!video) {
//       return res.status(404).json({ message: 'Video not found' });
//     }

//     // Create and save the comment
//     const newComment = new Comment({
//       user: req.user.id,     // from authentication middleware
//       video: videoId,
//       message,
//     });

//     await newComment.save();

//     res.status(201).json({
//       message: 'Comment added successfully',
//       comment: newComment,
//     });
//   } catch (error) {
//     console.error('Add comment error:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }

export async function addComment(req, res) {
  try {
    const { videoId, message } = req.body;

    if (!videoId || !message) {
      return res.status(400).json({ message: 'Video ID and comment text are required' });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const newComment = new Comment({
      user: req.user.id, // Authenticated user
      videoId,           // ✔ match schema field
      message,
    });

    await newComment.save();

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



// GET COMMENTS BY VIDEO ID
// export async function getCommentsByVideoId(req, res) {
//   try {
//     const { videoId } = req.params;

//     const comments = await Comment.find({ video: videoId })
//       .populate('user', 'userName channelName profilePic') // get user info
//       .sort({ createdAt: -1 }); // newest first

//     res.status(200).json({ comments });
//   } catch (error) {
//     console.error('Get comments error:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }

export async function getCommentsByVideoId(req, res) {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({ videoId }) // ✔ match schema field
      .populate('user', 'userName channelName profilePic')
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


// PUT /api/comments/:commentId
export async function updateComment(req, res) {
  try {
    const { commentId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only the owner can update
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.message = message;
    await comment.save();

    res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.error("Update comment error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// DELETE /api/comments/:commentId
export async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only the owner can delete
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}



