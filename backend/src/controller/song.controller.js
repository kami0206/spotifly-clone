import { Album } from "../models/album.model.js";
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
export const getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Tìm bài hát theo id mà không populate albumId
    const song = await Song.findById(id).select(
      "_id title artist imageUrl audioUrl duration albumId createdAt"
    );

    if (!song) {
      return res.status(404).json({ message: "Song not found." });
    }

    res.json(song);
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

    // Tìm kiếm bài hát
    const songs = await Song.find({
      $or: [{ title: regex }, { artist: regex }],
    }).select("_id title artist imageUrl audioUrl");

    // Tìm kiếm album
    const albums = await Album.find({
      $or: [{ title: regex }, { artist: regex }],
    }).select("_id title artist imageUrl releaseYear");

    // Trả kết quả cả hai
    res.json({ songs, albums });
  } catch (error) {
    next(error);
  }
};
