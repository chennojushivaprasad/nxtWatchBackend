import express from "express";
import {
  addLike,
  checkLikedVideo,
  getMyLikedVideos,
  removeLike,
} from "../controllers/likeController.js";


const router = express.Router();

router.post("/add/:videoId/:userId", addLike);

router.get("/", getMyLikedVideos);

router.get("/:videoId/:userId", checkLikedVideo);

router.delete("/remove/:videoId/:userId", removeLike);

export default router
