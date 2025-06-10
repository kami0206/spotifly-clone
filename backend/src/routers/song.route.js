import { Router } from "express";
import {
  getAllSongs,
  getFeaturedSongs,
  getMadeForYouSongs,
  getSongById,
  getTrendingSongs,
  searchSongs,
} from "../controller/song.controller.js";
import { protectRoute,  } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/search", searchSongs);
router.get("/:id", getSongById);

export default router;
