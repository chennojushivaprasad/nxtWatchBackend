import mongoose from "mongoose";

const channelSchema = mongoose.Schema({
  channelName: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2012/04/26/19/43/profile-42914_1280.png",
  },
  description: { type: String },
  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber",
      required: true,
    },
  ],
});

export default mongoose.model("Channel", channelSchema);
