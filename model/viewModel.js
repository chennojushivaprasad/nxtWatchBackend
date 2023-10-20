import mongoose from "mongoose";

const viewsSchema = new mongoose.Schema({
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video', // Reference to the Video model
    required: true,
  },
  viewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  viewDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('View', viewsSchema);


