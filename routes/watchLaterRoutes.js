import express from "express";
import { addWatchLater, removeWatchLater, watchLaterList } from "../controllers/watchLaterController.js";


const router = express.Router();

router.get("/", watchLaterList);

router.post("/add", addWatchLater);

router.delete("/remove", removeWatchLater);


export default router
