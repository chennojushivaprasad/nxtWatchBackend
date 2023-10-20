import mongoose from "mongoose";

const dislikeSchema = new mongoose.Schema({
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

const Dislike = mongoose.model('Dislike', dislikeSchema);

export default Dislike
