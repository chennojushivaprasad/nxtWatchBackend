import { ApiFeatures } from "../helper/apiFeature.js";
import WatchLater from "../model/watchLaterModel.js";

export const addWatchLater = async (req, res) => {
  try {
    const { userId, videoId } = req.body;

    const watchLaterItem = new WatchLater({
      user: userId,
      video: videoId,
    });

    await watchLaterItem.save();
    res.status(201).json({ message: "Video added to Watch Later" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

export const watchLaterList = async (req, res) => {
 
  const resultPerPage = parseInt(req.query.resultPerPage);
  const currentPage = parseInt(req.query.page);

  try {
    const apiFeature = new ApiFeatures(WatchLater.find().populate("video"), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const totalNumberOfItems = await WatchLater.countDocuments(
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

export const removeWatchLater = async (req, res) => {
  try {
    const { userId, videoId } = req.body;
    await WatchLater.findOneAndDelete({ user: userId, video: videoId });
    res.status(200).json({ message: "Video removed from Watch Later" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};
