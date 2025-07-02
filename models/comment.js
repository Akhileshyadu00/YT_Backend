import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Match the User model name
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video", // Match the Video model name
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true } // Correctly enabled timestamps
);

// Export as Mongoose model
export default mongoose.model("Comment", commentSchema);
