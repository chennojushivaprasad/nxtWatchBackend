import mongoose from "mongoose";

const subscriberSchema = mongoose.Schema({
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Channel",
    required: true,
  },
  subscribed_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  subscribeDate: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Subscriber", subscriberSchema);
