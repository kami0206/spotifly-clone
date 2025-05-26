import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import { Song } from "../models/song.model.js";

export const getPlaylistById = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId)
      .populate({
        path: "songs",
        select: "title artist imageUrl duration albumId audioUrl createdAt",
        populate: { path: "albumId", select: "title" },
      })
      .populate("creator", "fullName"); // Thêm populate cho creator
    if (!playlist) {
      return res.status(404).json({ message: "Danh sách phát không tồn tại" });
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách phát", error });
  }
};

export const getAllPlaylists = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tìm thấy" });
    }
    const playlists = await Playlist.find({ creator: user._id })
      .populate({
        path: "songs",
        select: "title artist imageUrl duration albumId audioUrl createdAt",
        populate: { path: "albumId", select: "title" },
      })
      .populate("creator", "fullName"); // Thêm populate cho creator
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách phát", error });
  }
};

export const createOrUpdatePlaylist = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tìm thấy" });
    }

    const { title, imageUrl, songIds = [] } = req.body;

    // Loại bỏ trùng lặp trong songIds từ request
    const uniqueSongIds = [...new Set(songIds)];

    // Kiểm tra tính hợp lệ của songIds
    const validSongs = await Song.find({ _id: { $in: uniqueSongIds } });
    if (validSongs.length !== uniqueSongIds.length) {
      return res.status(400).json({ message: "Một số bài hát không hợp lệ" });
    }

    let playlist = await Playlist.findOne({ title, creator: user._id });
    if (!playlist) {
      // Tạo playlist mới
      playlist = new Playlist({
        title,
        imageUrl:
          imageUrl ||
          (uniqueSongIds.length > 0
            ? (await Song.findById(uniqueSongIds[0])).imageUrl
            : null),
        creator: user._id,
        songs: uniqueSongIds,
      });
    } else {
      // Cập nhật playlist hiện có
      // Loại bỏ các songId đã tồn tại trong playlist
      const existingSongIds = playlist.songs.map((id) => id.toString());
      const newSongIds = uniqueSongIds.filter(
        (id) => !existingSongIds.includes(id.toString())
      );

      // Chỉ thêm các bài hát mới
      if (newSongIds.length > 0) {
        playlist.songs = [...new Set([...playlist.songs, ...newSongIds])];
      }
    }

    await playlist.save();
    await playlist.populate({
      path: "songs",
      select: "title artist imageUrl duration albumId audioUrl createdAt",
      populate: { path: "albumId", select: "title" },
    });
    await playlist.populate("creator", "fullName");

    res.status(201).json(playlist);
  } catch (error) {
    console.error("Lỗi khi tạo/cập nhật playlist:", error);
    res.status(500).json({ message: "Lỗi khi tạo/cập nhật playlist", error });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.auth?.userId;
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tìm thấy" });
    }
    const playlist = await Playlist.findOneAndDelete({
      _id: playlistId,
      creator: user._id,
    });
    if (!playlist) {
      return res
        .status(404)
        .json({ message: "Danh sách phát không tồn tại hoặc không có quyền" });
    }
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa danh sách phát", error });
  }
};
export const removeSongsFromPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { songIds } = req.body; // Array of song IDs to remove
    const userId = req.auth?.userId;

    // Find the user
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tìm thấy" });
    }

    // Find the playlist
    const playlist = await Playlist.findOne({
      _id: playlistId,
      creator: user._id,
    });
    if (!playlist) {
      return res
        .status(404)
        .json({ message: "Danh sách phát không tồn tại hoặc không có quyền" });
    }

    // Ensure songIds is an array and not empty
    if (!Array.isArray(songIds) || songIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách bài hát không hợp lệ" });
    }

    // Remove specified songs from the playlist
    playlist.songs = playlist.songs.filter(
      (songId) => !songIds.includes(songId.toString())
    );

    // Save the updated playlist
    await playlist.save();

    // Populate the playlist for response
    await playlist.populate({
      path: "songs",
      select: "title artist imageUrl duration albumId audioUrl createdAt",
      populate: { path: "albumId", select: "title" },
    });
    await playlist.populate("creator", "fullName");

    res.json({
      message: "Xóa bài hát khỏi danh sách phát thành công",
      playlist,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa bài hát khỏi danh sách phát", error });
  }
};
