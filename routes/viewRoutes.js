import express from "express";
import { recordView } from "../controllers/viewController.js";

const router = express();

router.post("/record-view", recordView);

export default router;
