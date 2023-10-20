import mongoose from "mongoose";
import Channel from "../model/channelModel.js";
import User from "../model/userModel.js";
import Subscribe from "../model/subscribeModel.js";

const createChannel = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { channelName, logo, description, userId } = req.body;

    const newChannel = new Channel({
      channelName,
      logo,
      description,
      user: userId,
    });

    const savedChannel = await newChannel.save();

    const user = await User.findById(userId);

    user.channelId = savedChannel._id;

    await user.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(savedChannel);
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ error: "Failed to create a channel" });
  }
};

const getChannels = async (req, res) => {
  try {
    const channels = await Channel.find();
    res.status(200).json(channels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch channels" });
  }
};

const getChannelById = async (req, res) => {
  const { channelId } = req.params;
  try {
    const channel = await Channel.findById(channelId);
  
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }
 
    res.status(200).json(channel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch the channel" });
  }
};

const updateChannel = async (req, res) => {
  const { channelId } = req.params;
  try {
    const { name, logo, description, subscribers } = req.body;
    const updatedChannel = await Channel.findByIdAndUpdate(
      channelId,
      {
        name,
        logo,
        description,
        subscribers,
      },
      { new: true }
    );
    if (!updatedChannel) {
      return res.status(404).json({ error: "Channel not found" });
    }
    res.json(updatedChannel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update the channel" });
  }
};

const deleteChannel = async (req, res) => {
  try {
    const deletedChannel = await Channel.findByIdAndDelete(
      req.params.channelId
    );
    if (!deletedChannel) {
      return res.status(404).json({ error: "Channel not found" });
    }
    res.json(deletedChannel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete the channel" });
  }
};

export {
  createChannel,
  getChannels,
  getChannelById,
  updateChannel,
  deleteChannel,
};
