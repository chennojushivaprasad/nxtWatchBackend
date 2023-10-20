import Views from "../model/viewModel.js"
import Video from "../model/videoModel.js"

const recordView = async (req, res) => {
  try {
    const videoId = req.body.videoId;
    const userId = req.body.userId;

    const existingView = await Views.findOne({ video: videoId, viewer: userId });

    if (existingView) {

      return res.status(400).json({ error: 'View already recorded' });
    } else {

      const view = new Views({
        video: videoId,
        viewer: userId,
      });

      await view.save();

      await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

      res.status(200).json({ message: 'View recorded successfully' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {recordView}