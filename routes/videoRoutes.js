import express from "express";

import { isAuthenticatedUser } from "../middleware/auth.js";

import { upload } from "../config/multer.js";
import {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  getChannelVideos,
  getPopularVideos,
} from "../controllers/videoController.js";

const videoRouter = express.Router();

videoRouter.post(
  "/",
  isAuthenticatedUser,
  upload.single("videoFile"),
  createVideo
);

videoRouter.get("/", getAllVideos);

videoRouter.get("/videos/:channelId", getChannelVideos);

videoRouter.get("/popular-videos", getPopularVideos);

videoRouter.get("/:videoId/:userId", getVideoById);

videoRouter.post("/upload-video",upload.fields([{ name: 'video' }, { name: 'thumbnail' }]), createVideo);

videoRouter.put("/:id", isAuthenticatedUser, updateVideo);

videoRouter.delete("/:id", isAuthenticatedUser, deleteVideo);

export default videoRouter;
