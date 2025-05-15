import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/type";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
  searchSongs: (query: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  // Initial state
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
  featuredSongs: [],
  trendingSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },

  // Fetch all songs
  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs");
      if (response?.data) {
        set({ songs: response.data });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching songs:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch featured songs
  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/featured");
      if (response?.data) {
        set({ featuredSongs: response.data });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching featured songs:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch trending songs
  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/trending");
      if (response?.data) {
        set({ trendingSongs: response.data });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching trending songs:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch "Made For You" songs
  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/made-for-you");
      if (response?.data) {
        set({ madeForYouSongs: response.data });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching made-for-you songs:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch all albums
  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/albums");
      if (response?.data) {
        set({ albums: response.data });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching albums:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch album by ID
  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);
      if (response?.data) {
        set({ currentAlbum: response.data });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching album by ID:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch stats
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/stats");
      if (response?.data) {
        set({ stats: response.data });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete a song
  deleteSong: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/songs/${id}`);
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));
      toast.success("Song deleted successfully");
    } catch (error: any) {
      console.error("Error deleting song:", error);
      toast.error("Error deleting song");
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete an album
  deleteAlbum: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/albums/${id}`);
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== id),
        songs: state.songs.map((song) =>
          song.albumId === id ? { ...song, album: null } : song
        ),
      }));
      toast.success("Album deleted successfully");
    } catch (error: any) {
      console.error("Error deleting album:", error);
      toast.error("Failed to delete album");
    } finally {
      set({ isLoading: false });
    }
  },
  searchSongs: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/songs/search?q=${encodeURIComponent(query)}`
      );
      if (response?.data) {
        set({ songs: response.data });
      } else {
        throw new Error("No data received from API");
      }
    } catch (error: any) {
      console.error("Error searching songs:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
