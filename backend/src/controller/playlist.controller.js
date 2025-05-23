import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";

export const getAllPlaylists = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }
    const playlists = await Playlist.find({ creator: user._id })
      .populate("creator", "fullName")
      .populate("songs", "title artist imageUrl");
    res.json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res
      .status(500)
      .json({ message: "Error fetching playlists", error: error.message });
  }
};

export const getPlaylistById = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId)
      .populate("creator", "fullName")
      .populate("songs", "title artist imageUrl");
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.json(playlist);
  } catch (error) {
    console.error("Error fetching playlist by ID:", error);
    res
      .status(500)
      .json({ message: "Error fetching playlist", error: error.message });
  }
};
