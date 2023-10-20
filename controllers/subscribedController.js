import Subscribe from "../model/subscribeModel.js";
import Channel from "../model/channelModel.js";
import Video from "../model/videoModel.js";

export const createSubscriber = async (req, res) => {
  const { channelId, userId } = req.params;

  const session = await Channel.startSession();

  try {
    session.startTransaction();

    const subscriber = new Subscribe({
      subscribed_user: userId,
      channel: channelId,
    });

    const data = await subscriber.save();

    const channel = await Channel.findById(channelId);
    channel.subscribers.push(data._id);
    await channel.save();

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(subscriber);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({ error: error.message });
  }
};

export const getSubscribedVideos = async (req, res) => {
  const { userId } = req.params;
  try {
    const currentPage = parseInt(req.query?.page) || 1;
    const resultPerPage = parseInt(req.query?.resultPerPage) || 10;

    const subscriptions = await Subscribe.find({ subscribed_user: userId })
      .populate('channel') // Populate the "channel" field with channel information
      .exec();

    const channelIds = subscriptions.map((sub) => sub.channel._id);

    const totalNumberOfItems = await Video.countDocuments({
      channel: { $in: channelIds },
    });

    const skip = (currentPage - 1) * resultPerPage;

    const subscribedVideos = await Video.aggregate([
      {
        $match: { channel: { $in: channelIds } },
      },
      {
        $sort: { published_at: -1 },
      },
      {
        $group: {
          _id: "$channel",
          videos: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          channel: "$_id",
          videos: { $slice: ["$videos", skip, resultPerPage] },
        },
      },
      {
        $lookup: {
          from: "channels",
          localField: "channel",
          foreignField: "_id",
          as: "channel_info",
        },
      },
      {
        $unwind: "$channel_info",
      },
      {
        $project: {
          "videos.__v": 0, // Exclude the "__v" field from videos
          "channel_info.__v": 0,
         // Exclude the "_id" field from channel_info
        },
      },
    ]);

    subscribedVideos.forEach((subscription) => {
      subscription.videos.forEach((video) => {
        video.channel = subscription.channel_info;
      });
    });

    res.status(200).json({
      subscriptions,
      videos: subscribedVideos[0]?.videos,
      currentPage,
      totalNumberOfItems,
      resultPerPage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getSubscribersForChannel = async (req, res) => {
  try {
    const channel = req.params.channelId;
    const subscribers = await Subscribe.find({ channel }).populate(
      "subscribed_user"
    );
    res.status(200).json(subscribers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getSubscribedChannels = async (req, res) => {
  const { userId } = req.params;
  try {
    const channels = await Subscribe.find({ subscribed_user: userId }).populate(
      "channel"
    );
    console.log(channels);
    res.status(200).json(channels);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
};

export const unsubscribeFromChannel = async (req, res) => {
  const { channelId, userId } = req.params;
  const session = await Channel.startSession();

  try {
    session.startTransaction();

    const subscriber = await Subscribe.findOneAndDelete({
      channel: channelId,
      subscribed_user: userId,
    });

    if (subscriber) {
      const channel = await Channel.findById(channelId);
      channel.subscribers.pull(subscriber?._id);
      await channel.save();
    } else {
      throw new Error("Subscriber not found");
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Unsubscribed successfully" });
  } catch (error) {
    console.log(error, "sub");
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({ error: error.message });
  }
};

export const checkSubscription = async (req, res) => {
  const { channelId, userId } = req.params;

  try {
    const subscription = await Subscribe.findOne({
      channel: channelId,
      subscribed_user: userId,
    });

    if (subscription) {
      res.json({ subscribed: true });
    } else {
      res.json({ subscribed: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};
