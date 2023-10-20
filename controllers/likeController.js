import Video from "../model/videoModel.js";
import Like from "../model/likeModel.js";

const getMyLikedVideos = async (req, res) => {
  const user = req.authenticatedUser._id;
  const resultsPerPage = parseInt(req.query.resultsPerPage);
  const currentPage = parseInt(req.query.currentPage);

  try {
    const totalNumberOfItems = await Like.countDocuments({ user });
    const Likes = await Like.find({ user })
      .skip((currentPage - 1) * resultsPerPage)
      .limit(resultsPerPage)
      .sort({ addedAt: -1 })
      .populate("product");

    return res
      .status(200)
      .json({ Likes, resultsPerPage, currentPage, totalNumberOfItems });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

const checkLikedVideo = async (req, res) => {
  const { videoId, userId } = req.params;

  try {
    const user = userId;
    const video = videoId;
    const like = await Like.findOne({
      user,
      video,
      liked: true,
    });

    res.status(200).json({ liked: !!like });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addLike = async (req, res) => {
  const { userId, videoId } = req.params;
  try {
    const like = new Like({
      user: userId,
      video: videoId,
      liked: true,
    });
    await like.save();
    await Video.findByIdAndUpdate(videoId, { $inc: { likes: 1 } });

    res.status(201).json(like);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeLike = async (req, res) => {
  const { userId, videoId } = req.params;

  try {
    const like = await Like.findOneAndDelete({
      user: userId,
      video: videoId,
    });
    await Video.findByIdAndUpdate(videoId, { $inc: { likes: -1 } });

    if (!like) {
      return res.status(404).json({ error: "DisLike not found" });
    }
    res.status(200).json(like);
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
};

export { getMyLikedVideos, checkLikedVideo, addLike, removeLike };
