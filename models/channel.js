import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
      unique: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    description: {
      type: String
    },
    channelBanner: {
      type: String, // Store URL or file path
      default: ""   // Optional: set a default banner image URL
    },
    subscribers: {
      type: Number,
      default: 0
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Channel", channelSchema);
