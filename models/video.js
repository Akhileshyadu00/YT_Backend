import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model (capitalize for consistency)
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    videoLink: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+/.test(v); // Basic URL validation
        },
        message: "Invalid video URL format.",
      },
    },
    thumbnail: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: "Invalid thumbnail URL format.",
      },
    },
    videoType: {
      type: String,
      required: true,
      default: "All",
      enum: ["All", "Music", "Tutorial", "Gaming", "News", "Other"], // Extendable
    },
    like: {
      type: Number,
      default: 0,
      min: 0,
    },
    dislike: {
      type: Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
