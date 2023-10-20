import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import videoRouter from "./routes/videoRoutes.js";
import channelRouter from "./routes/channelRoutes.js";
import viewRouter from "./routes/viewRoutes.js";
import likeRouter from "./routes/likeRoutes.js";
import dislikeRouter from "./routes/dislikeRoutes.js";
import watchLaterRouter from "./routes/watchLaterRoutes.js";
import subscribeRouter from "./routes/subscribeRoutes.js";

// import commentRouter from "./routes/commentRoutes.js"

dotenv.config({ path: ".env" });

const PORT = 3006 || process.env.PORT;

const app = express();

app.use('/uploads', express.static('uploads'));


app.use(
  cors({
    origin: "http://localhost:3004",
  })
);


app.use(express.json());

app.use("/api", userRouter);

app.use("/api/channel", channelRouter);

app.use("/api/video", videoRouter);

app.use("/api/views", viewRouter);

app.use("/api/like", likeRouter);

app.use("/api/dislike", dislikeRouter);

app.use("/api/subscription", subscribeRouter);

app.use("/api/watch-later", watchLaterRouter);

// app.use("/api/comment", commentRouter);

const MONGODB_URL = process.env.MONGODB_URL;

mongoose
  .connect(MONGODB_URL)
  .then((respone) => console.log("connected to database"))
  .catch((error) => console.log(error));


app.listen(PORT, () => {
  console.log("server started", PORT);
});
