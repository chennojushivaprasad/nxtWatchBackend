import Video from "../model/videoModel.js";
import Dislike from "../model/dislikeModel.js";

// const getMyDislikedVideos = async (req, res) => {
//   const user = req.authenticatedUser._id;
//   const resultsPerPage = parseInt(req.query.resultsPerPage);
//   const currentPage = parseInt(req.query.currentPage);

//   try {
//     const totalNumberOfItems = await Dislike.countDocuments({ user });
//     const dislikes = await Dislike.find({ user })
//       .skip((currentPage - 1) * resultsPerPage)
//       .limit(resultsPerPage)
//       .sort({ addedAt: -1 })

//     return res
//       .status(200)
//       .json({ dislikes, resultsPerPage, currentPage, totalNumberOfItems });
//   } catch (error) {
//     return res.status(500).json({ message: "something went wrong" });
//   }
// };

const checkDislikedVideo = async (req, res) => {
  const { videoId, userId } = req.params;

  try {
    const user = userId;
    const video = videoId;
    const dislike = await Dislike.findOne({
      user,
      video,
    });

    res.status(200).json({ dislike: !!dislike });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addDislike = async (req, res) => {
  const { userId, videoId } = req.params;
  try {
    const dislike = new Dislike({
      user: userId,
      video: videoId,
    });
    await dislike.save();
    await Video.findByIdAndUpdate(videoId, { $inc: { dislikes: 1 } });

    res.status(201).json(dislike);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeDislike = async (req, res) => {
  const { userId, videoId } = req.params;

  try {
    const dislike = await Dislike.findOneAndDelete({
      user: userId,
      video: videoId,
    });
    await Video.findByIdAndUpdate(videoId, { $inc: { dislikes: -1 } });

    if (!dislike) {
      return res.status(404).json({ error: "DisLike not found" });
    }
    res.status(200).json(dislike);
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
};

export {  checkDislikedVideo, addDislike, removeDislike };
