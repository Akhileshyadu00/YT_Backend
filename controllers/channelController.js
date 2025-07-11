import Channel from '../models/channel.js';
import mongoose from 'mongoose';

// Create a new channel
export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;
    const channel = new Channel({
      channelName,
      description,
      channelBanner,
      owner: req.user.id
    });
    await channel.save();
    res.status(201).json(channel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a channel by ID
// export const getChannel = async (req, res) => {
//   try {
//     const channel = await Channel.findById(req.params.id)
//       .populate('owner', 'username avatar')
//       .populate('videos');
//     if (!channel) return res.status(404).json({ message: 'Channel not found' });
//     res.json(channel);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



export const getChannel = async (req, res) => {
  try {
    // console.log("Requested channel id:", req.params.id);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid channel id' });
    }
    const channel = await Channel.findById(req.params.id)
      .populate('owner', 'username avatar')
      .populate('videos');
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    res.json(channel);
  } catch (err) {
    console.error("Error fetching channel:", err); // This will log the real error
    res.status(500).json({ message: err.message });
  }
};


// List all channels
export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find().populate('owner', 'username avatar');
    res.json(channels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a channel
export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    if (channel.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    Object.assign(channel, req.body);
    await channel.save();
    res.json(channel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a channel
export const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    if (channel.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    await Channel.deleteOne({ _id: req.params.id });
    res.json({ message: 'Channel deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};