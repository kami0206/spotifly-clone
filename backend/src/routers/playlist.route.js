import { Router } from "express";
import { getAllPlaylists, getPlaylistById } from "../controller/playlist.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/",protectRoute, getAllPlaylists);
router.get("/:playlistId",protectRoute, getPlaylistById);

export default router;