import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  fullname: { type: String, required: true,  maxLength: 25 },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  avatar: {
    url: {
      type: String,
      required: true,
      default:
        "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png",
    },
  },
  channelId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
  },
  role: {
    type: String,
    default: "user",
  },
});

export default mongoose.model("User", userSchema);
