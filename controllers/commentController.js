
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


