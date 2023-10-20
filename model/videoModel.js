import mongoose from "mongoose";

const videoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  video: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  thumbnail: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },

  category: {
    type: String,
    required: true,
    enum: [
      "Entertainment",
      "Film & Animation",
      "Autos & Vehicles",
      "Music",
      "Pets & Animals",
      "Sports",
      "Travel & Events",
      "Gaming",
      "People & Blogs",
      "Comedy",

      "News & Politics",
      "Howto & Style",
      "Education",
      "Science & Technology",
      "Nonprofits & Activism",
    ],
  },
  duration: {
    type: Number,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  published_at: {
    type: Date,
    default: Date.now,
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
});

export default mongoose.model("Video", videoSchema);
