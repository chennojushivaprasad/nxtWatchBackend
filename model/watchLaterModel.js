import mongoose from "mongoose";

const watchLaterSchema = new mongoose.Schema({
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

const WatchLater = mongoose.model('WatchLater', watchLaterSchema);

export default WatchLater;
