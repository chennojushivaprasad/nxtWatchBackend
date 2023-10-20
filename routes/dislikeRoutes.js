import express from "express";
import {
  addDislike,
  removeDislike,
  checkDislikedVideo,
} from "../controllers/dislikeController.js";


const router = express.Router();

router.post("/add/:videoId/:userId", addDislike);

// router.get("/", getMyDislikedVideos);

router.get("/:videoId/:userId", checkDislikedVideo);

router.delete("/remove/:videoId/:userId", removeDislike);

export default router
