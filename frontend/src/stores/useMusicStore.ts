import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats, Playlist } from "@/type";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  albums: Album[];
  allAlbums: Album[];
  playlists: Playlist[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;
  currentSongInfo: Song | null;
  currentPlaylist: Playlist | null;
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
  fetchSongById: (id: string) => Promise<void>;
  fetchPlaylists: () => Promise<void>;
  fetchPlaylistById: (id: string) => Promise<void>; // Added for PlaylistPage
  deletePlaylist: (id: string) => Promise<void>;
  createOrUpdatePlaylist: (
    title: string,
    imageUrl?: string,
    songIds?: string[]
  ) => Promise<Playlist | void>;
  removeSongsFromPlaylist: (
    playlistId: string,
    songIds: string[]
  ) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  allAlbums: [],
  playlists: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  currentSongInfo: null,
  currentPlaylist: null,
  madeForYouSongs: [],
  featuredSongs: [],
  trendingSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },

  fetchSongById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/songs/${id}`);
      if (response?.data) {
        const song = response.data;
        set({ currentSongInfo: song });
        if (song.albumId) {
          const albumResponse = await axiosInstance.get(
            `/albums/${song.albumId}`
          );
          if (albumResponse?.data) {
            set({ currentAlbum: albumResponse.data });
          } else {
            set({ currentAlbum: null });
          }
        } else {
          set({ currentAlbum: null });
        }
      } else {
        throw new Error("Không nhận được dữ liệu từ API");
      }
    } catch (error: any) {
      console.error("Lỗi khi lấy bài hát theo ID:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs");
      if (response?.data) {
        set({ songs: response.data });
      } else {
        throw new Error("Không nhận được dữ liệu từ API");
      }
    } catch (error: any) {
      console.error("Lỗi khi lấy bài hát:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log("Fetching from /songs/featured");
      const response = await axiosInstance.get("/songs/featured");
      if (response?.data) {
        set({ featuredSongs: response.data });
      } else {
        throw new Error("Không nhận được dữ liệu từ API");
      }
    } catch (error: any) {
      console.error("Lỗi khi lấy bài hát nổi bật:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log("Fetching from /songs/made-for-you");
      const response = await axiosInstance.get("/songs/made-for-you");
      if (response?.data) {
        set({ madeForYouSongs: response.data });
      } else {
        throw new Error("Không nhận được dữ liệu từ API");
      }
    } catch (error: any) {
      console.error("Lỗi khi lấy bài hát dành cho bạn:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log("Fetching from /songs/trending");
      const response = await axiosInstance.get("/songs/trending");
      if (response?.data) {
        set({ trendingSongs: response.data });
      } else {
        throw new Error("Không nhận được dữ liệu từ API");
      }
    } catch (error: any) {
      console.error("Lỗi khi lấy bài hát thịnh hành:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/albums");
      if (response?.data) {
        set({ albums: response.data, allAlbums: response.data });
      } else {
        throw new Error("Không nhận được dữ liệu từ API");
      }
    } catch (error: any) {
      console.error("Lỗi khi lấy album:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);
      if (response?.data) {
        set({ currentAlbum: response.data });
      } else {
        throw new Error("Không nhận được dữ liệu từ API");
      }
    } catch (error: any) {
      console.error("Lỗi khi lấy album theo ID:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlaylists: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/playlists");
      if (response?.data) {
        set({ playlists: response.data });
      } else {
        throw new Error("Không nhận được dữ liệu từ API");
      }
    } catch (error: any) {
      console.error("Lỗi khi lấy danh sách phát:", error);
      const errorMessage =
        error.response?.status === 401
          ? "Vui lòng đăng nhập để xem danh sách phát"
          : error.response?.data?.message || error.message;
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
  fetchPlaylistById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/playlists/${id}`);
      if (response?.data) {
        set({ currentPlaylist: response.data });
      } else {
        throw new Error("Không nhận được dữ liệu từ API");
      }
    } catch (error: any) {
      console.error("Lỗi khi lấy playlist theo ID:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlaylist: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/playlists/${id}`);
      set((state) => ({
        playlists: state.playlists.filter((playlist) => playlist._id !== id),
      }));
      toast.success("Xóa danh sách phát thành công");
    } catch (error: any) {
      console.error("Lỗi khi xóa danh sách phát:", error);
      toast.error("Xóa danh sách phát thất bại");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/stats");
      if (response?.data) {
        set({ stats: response.data });
      } else {
        throw new Error("Không nhận được dữ liệu từ API");
      }
    } catch (error: any) {
      console.error("Lỗi khi lấy thống kê:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSong: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/songs/${id}`);
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== id),
      }));
      toast.success("Xóa bài hát thành công");
    } catch (error: any) {
      console.error("Lỗi khi xóa bài hát:", error);
      toast.error("Lỗi khi xóa bài hát");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAlbum: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/albums/${id}`);
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== id),
        allAlbums: state.allAlbums.filter((album) => album._id !== id),
        songs: state.songs.map((song) =>
          song.albumId === id ? { ...song, album: null } : song
        ),
      }));
      toast.success("Xóa album thành công");
    } catch (error: any) {
      console.error("Lỗi khi xóa album:", error);
      toast.error("Xóa album thất bại");
    } finally {
      set({ isLoading: false });
    }
  },

  searchSongs: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/songs/search?query=${encodeURIComponent(query)}`
      );
      if (response?.data) {
        set({
          songs: response.data.songs || [],
          albums: response.data.albums || [],
        });
      } else {
        throw new Error("Không nhận được dữ liệu từ API");
      }
    } catch (error: any) {
      console.error("Lỗi khi tìm kiếm bài hát:", error);
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  createOrUpdatePlaylist: async (
    title: string,
    imageUrl?: string,
    songIds: string[] = []
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/playlists/cr", {
        title,
        imageUrl, // Include imageUrl to allow manual override
        songIds,
      });
      if (response?.data) {
        const newPlaylist = response.data as Playlist;
        set((state) => ({
          playlists: [...state.playlists, newPlaylist],
        }));
        toast.success("Tạo/cập nhật playlist thành công");
        return newPlaylist;
      } else {
        throw new Error("Không nhận được dữ liệu từ API");
      }
    } catch (error: any) {
      console.error("Lỗi khi tạo/cập nhật danh sách phát:", error);
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
  removeSongsFromPlaylist: async (playlistId: string, songIds: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch(
        `/playlists/${playlistId}/songs`,
        {
          songIds,
        }
      );
      if (response?.data?.playlist) {
        const updatedPlaylist = response.data.playlist;
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist._id === playlistId ? updatedPlaylist : playlist
          ),
          currentPlaylist:
            state.currentPlaylist?._id === playlistId
              ? updatedPlaylist
              : state.currentPlaylist,
        }));
        toast.success("Xóa bài hát khỏi danh sách phát thành công");
      } else {
        throw new Error("Không nhận được dữ liệu từ API");
      }
    } catch (error: any) {
      console.error("Lỗi khi xóa bài hát khỏi danh sách phát:", error);
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
}));
