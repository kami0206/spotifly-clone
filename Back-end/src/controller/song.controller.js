import { Song } from "../models/song.model.js";

// Không cần định nghĩa lại hàm requestZingMp3 ở đây
export const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedSongs = async (req, res, next) => {
  try {
    // fetch 6 random songs using mongodb's aggregation pipeline
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.json(songs);
  } catch (error) {
    next(error);
  }
};

export const getMadeForYouSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.json(songs);
  } catch (error) {
    next(error);
  }
};

export const getTrendingSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.json(songs);
  } catch (error) {
    next(error);
  }
};

export const searchSongs = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Missing query parameter." });
    }

    const regex = new RegExp(query, "i");

    const songs = await Song.find({
      $or: [{ title: regex }, { artist: regex }],
    }).select("_id title artist imageUrl audioUrl");

    res.json(songs);
  } catch (error) {
    next(error);
  }
};
export const getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tìm bài hát theo id
    const song = await Song.findById(id).select(
      "_id title artist imageUrl audioUrl duration albumId shareCount"
    );

    if (!song) {
      return res.status(404).json({ message: "Song not found." });
    }

    res.json(song);
  } catch (error) {
    next(error);
  }
};
export const shareSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id).select(
      "_id title artist imageUrl audioUrl"
    );

    if (!song) {
      return res.status(404).json({ message: "Song not found." });
    }

    // Optional: tăng số lượt chia sẻ
    await Song.findByIdAndUpdate(id, { $inc: { shareCount: 1 } });

    // Tạo link chia sẻ (có thể dùng domain thật của bạn)
    const shareUrl = `https://yourmusicapp.com/song/${song._id}`;

    res.json({
      message: "Share link generated successfully.",
      shareUrl,
      song,
    });
  } catch (error) {
    next(error);
  }
};
