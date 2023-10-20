import Video from "../model/videoModel.js";
import Like from "../model/likeModel.js";
import Dislike from "../model/dislikeModel.js";
import WatchLater from "../model/watchLaterModel.js";
import Subscribe from "../model/subscribeModel.js";

import { ApiFeatures } from "../helper/apiFeature.js";
import { cloudinary } from "../config/cloudinaryConfig.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadVideoToCloudinary = (video) => {
  return new Promise(async (resolve, reject) => {
    const rootUploadsPath = path.resolve(__dirname, "..", "uploads");
    const videoPath = `${rootUploadsPath}/${video.filename}`;

    try {
      const upload = await cloudinary.uploader.upload(videoPath, {
        resource_type: "video",
        folder: "/video",
      });
      resolve(upload);
    } catch (error) {
      console.error("Error uploading video to Cloudinary:", error);
      reject(error);
    }
  });
};

const uploadThumbnailToCloudinary = (thumbnail) => {
  return new Promise(async (resolve, reject) => {
    const rootUploadsPath = path.resolve(__dirname, "..", "uploads");
    const imgPath = `${rootUploadsPath}/${thumbnail.filename}`;

    try {
      const upload = await cloudinary.uploader.upload(imgPath, {
        resource_type: "image",
        folder: "/image",
      });
      resolve(upload);
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      reject(error);
    }
  });
};

const getAllVideos = async (req, res, next) => {
  const resultPerPage = parseInt(req.query.resultPerPage);
  const currentPage = parseInt(req.query.page);

  try {
    const apiFeature = new ApiFeatures(
      Video.find().populate({
        path: "channel",
        select: "channelName description logo",
      }),
      req.query
    )
      .search()
      .filter()
      .pagination(resultPerPage);

    const totalNumberOfItems = await Video.countDocuments(
      apiFeature.query._conditions
    );
    const videos = await apiFeature.query;
    return res
      .status(200)
      .json({ videos, currentPage, totalNumberOfItems, resultPerPage });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "No videos found" });
  }
};

const getPopularVideos = async (req, res, next) => {
  const resultPerPage = parseInt(req.query.resultPerPage);
  const currentPage = parseInt(req.query.page);

  try {
    const apiFeature = new ApiFeatures(
      Video.find().sort({ views: -1 }).populate({
        path: "channel",
        select: "channelName description logo",
      }),
      req.query
    )
      .search()
      .filter()
      .pagination(resultPerPage);

    const totalNumberOfItems = await Video.countDocuments(
      apiFeature.query._conditions
    );
    const videos = await apiFeature.query;
    return res
      .status(200)
      .json({ videos, currentPage, totalNumberOfItems, resultPerPage });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "No videos found" });
  }
};

const getChannelVideos = async (req, res, next) => {
  const { channelId } = req.params;
  const resultPerPage = parseInt(req.query.resultPerPage);
  const currentPage = parseInt(req.query.page);

  try {
    const apiFeature = new ApiFeatures(
      Video.find({ channel: channelId }).populate({
        path: "channel",
        select: "channelName description logo",
      }),
      req.query
    )
      .search()
      .pagination(resultPerPage);

    const totalNumberOfItems = await Video.countDocuments(
      apiFeature.query._conditions
    );
    const videos = await apiFeature.query;
    return res
      .status(200)
      .json({ videos, currentPage, resultPerPage, totalNumberOfItems });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "No Videos found" });
  }
};

// const getSubscribedVideos = async (req, res) => {
//  const {userId} = req.params
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.resultPerPage) || 10;

//     const subscriptions = await Subscribe.find({ subscriber: userId });

//     const channelIds = subscriptions.map((sub) => sub.channel);

//     const totalVideosCount = await Video.countDocuments({
//       channel: { $in: channelIds },
//     });

//     const totalPages = Math.ceil(totalVideosCount / limit);

//     const skip = (page - 1) * limit;

//     const subscribedVideos = await Video.aggregate([
//       {
//         $match: { channel: { $in: channelIds } },
//       },
//       {
//         $sort: { published_at: -1 }, // Sort by 'published_at' field in descending order for most recent first
//       },
//       {
//         $group: {
//           _id: "$channel",
//           videos: { $push: "$$ROOT" }, // Group videos by channel
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           channel: "$_id",
//           videos: { $slice: ["$videos", skip, limit] }, // Apply pagination
//         },
//       },
//       {
//         $lookup: {
//           from: "channels", // Replace with the actual name of your channels collection
//           localField: "channel",
//           foreignField: "_id",
//           as: "channel_info",
//         },
//       },
//       {
//         $unwind: "$channel_info",
//       },
//       {
//         $project: {
//           "videos.channel": 0,
//           "videos.__v": 0,
//           "channel_info.__v": 0,
//           "channel_info._id": 0,
//         },
//       },
//     ]);

//     console.log(subscribedVideos,"videos subscribed")
//     res.status(200).json({
//       videos: subscribedVideos,
//       page,
//       totalPages,
//       totalVideos: totalVideosCount,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getVideoById = async (req, res) => {
  const { videoId, userId } = req.params;
  let isLiked = false;
  let isDisLiked = false;
  let isWatchLaterAdded = false;
  let isSubscribed = false;
  try {
    const like = await Like.exists({ user: userId, video: videoId });
    const dislike = await Dislike.exists({ user: userId, video: videoId });
    const watchlater = await WatchLater.exists({
      user: userId,
      video: videoId,
    });

    const video = await Video.findById(videoId).populate("channel");
    const subscribed = await Subscribe.exists({
      channel: video?.channel,
      subscribed_user: userId,
    });

    if (like) {
      isLiked = true;
    }
    if (dislike) {
      isDisLiked = true;
    }
    if (watchlater) {
      isWatchLaterAdded = true;
    }
    if (subscribed) {
      isSubscribed = true;
    }
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res
      .status(200)
      .json({ video, isLiked, isDisLiked, isWatchLaterAdded, isSubscribed });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const createVideo = async (req, res) => {
  try {
    if (!req.files || !req.files.video || !req.files.thumbnail) {
      return res
        .status(400)
        .json({ error: "Both video and thumbnail files are required" });
    }

    const videoResult = await uploadVideoToCloudinary(req.files.video[0]);

    const thumbnailResult = await uploadThumbnailToCloudinary(
      req.files.thumbnail[0]
    );
    const video = new Video({
      ...req.body,
      video: { url: videoResult.secure_url, public_id: videoResult.public_id },
      thumbnail: {
        url: thumbnailResult.secure_url,
        public_id: thumbnailResult.public_id,
      },
    });

    await video.save();

    return res.status(201).json(video);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateVideo = async (req, res) => {
  const { videoId } = req.params;
  try {
    const video = await Video.findByIdAndUpdate(videoId, req.body, {
      new: true,
    });
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndRemove(req.params.id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllVideos,
  getChannelVideos,
  getPopularVideos,
  createVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
};
