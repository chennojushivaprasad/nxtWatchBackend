import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

const Like = mongoose.model('Like', likeSchema);

export default Like
