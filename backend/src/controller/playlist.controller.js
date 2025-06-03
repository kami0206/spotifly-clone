import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import { Song } from "../models/song.model.js";
import cloudinary from "../lib/cloudinary.js";

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    throw new Error("Error uploading to Cloudinary");
  }
};

export const getPlaylistById = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId)
      .populate({
        path: "songs",
        select: "title artist imageUrl duration albumId audioUrl createdAt",
        populate: { path: "albumId", select: "title" },
      })
      .populate("creator", "fullName");
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
      .populate("creator", "fullName");
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

    // Parse songIds from formData
    let songIds = [];
    if (req.body.songIds) {
      try {
        songIds = JSON.parse(req.body.songIds);
        if (!Array.isArray(songIds)) {
          throw new Error("songIds must be an array");
        }
      } catch (e) {
        console.error("Failed to parse songIds:", e);
        return res.status(400).json({ message: "Invalid songIds format" });
      }
    }

    const { title, description, playlistId } = req.body;
    const imageFile = req.files?.imageFile;

    const uniqueSongIds = [...new Set(songIds)];

    // Validate songIds if provided
    if (uniqueSongIds.length > 0) {
      const validSongs = await Song.find({
        _id: { $in: uniqueSongIds },
      }).select("_id imageUrl");
      if (validSongs.length !== uniqueSongIds.length) {
        return res.status(400).json({ message: "Một số bài hát không hợp lệ" });
      }
    }

    // Upload ảnh mới nếu có
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile);
    }

    let playlist = null;
    if (playlistId) {
      playlist = await Playlist.findById(playlistId);
      if (!playlist || playlist.creator.toString() !== user._id.toString()) {
        return res
          .status(404)
          .json({ message: "Playlist không tồn tại hoặc không có quyền" });
      }
    } else {
      playlist = await Playlist.findOne({ title, creator: user._id });
    }

    // Define default image URL
    const defaultImageUrl = "/public/cover-images/default.jpg"; // Adjust this to your default image path or URL

    if (!playlist) {
      // Tạo mới playlist
      if (!imageUrl && uniqueSongIds.length === 0) {
        imageUrl = defaultImageUrl; // Use default image if no image and no songs
      } else if (!imageUrl && uniqueSongIds.length > 0) {
        const firstSong = await Song.findById(uniqueSongIds[0]).select(
          "imageUrl"
        );
        imageUrl = firstSong?.imageUrl || defaultImageUrl; // Use song image or default
      }
      playlist = new Playlist({
        title,
        imageUrl,
        creator: user._id,
        songs: uniqueSongIds,
        description,
      });
    } else {
      // Cập nhật playlist
      if (title) {
        playlist.title = title;
      }
      if (description) {
        playlist.description = description;
      }
      if (imageUrl) {
        playlist.imageUrl = imageUrl; // Chỉ cập nhật imageUrl nếu có ảnh mới
      } else if (!playlist.imageUrl && uniqueSongIds.length > 0) {
        // Nếu playlist không có ảnh và có bài hát mới, lấy ảnh từ bài hát đầu tiên
        const firstSong = await Song.findById(uniqueSongIds[0]).select(
          "imageUrl"
        );
        playlist.imageUrl = firstSong?.imageUrl || defaultImageUrl;
      } else if (!playlist.imageUrl && uniqueSongIds.length === 0) {
        // Nếu không có ảnh và không có bài hát, dùng ảnh mặc định
        playlist.imageUrl = defaultImageUrl;
      }
      // Chỉ cập nhật songs nếu songIds được cung cấp
      if (uniqueSongIds.length > 0) {
        playlist.songs = [...new Set([...playlist.songs, ...uniqueSongIds])];
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
    const { songIds } = req.body;
    const userId = req.auth?.userId;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tìm thấy" });
    }

    const playlist = await Playlist.findOne({
      _id: playlistId,
      creator: user._id,
    });
    if (!playlist) {
      return res
        .status(404)
        .json({ message: "Danh sách phát không tồn tại hoặc không có quyền" });
    }

    if (!Array.isArray(songIds) || songIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách bài hát không hợp lệ" });
    }

    playlist.songs = playlist.songs.filter(
      (songId) => !songIds.includes(songId.toString())
    );

    await playlist.save();

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
