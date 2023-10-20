import express from "express";

import {
  checkSubscription,
  createSubscriber,
  getSubscribedChannels,
  getSubscribedVideos,
  getSubscribersForChannel,
  unsubscribeFromChannel,
} from "../controllers/subscribedController.js";

const router = express();

router.post("/add/:channelId/:userId", createSubscriber);

router.get("/:channelId", getSubscribersForChannel);

router.get("/channels/:userId", getSubscribedChannels);

router.get("/videos/:userId", getSubscribedVideos);

router.get("/check/:channelId/:userId", checkSubscription);

router.delete("/remove/:channelId/:userId", unsubscribeFromChannel);

export default router;
