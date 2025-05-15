import { Song } from "@/type";
import { create } from "zustand";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  originalQueue: Song[]; // 🔧 để khôi phục khi tắt shuffle
  currentIndex: number;
  isShuffling: boolean;
  isRepeating: boolean;

  toggleRepeat: () => void;
  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void; // 🔧 đổi tên từ shuffleQueue
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  originalQueue: [],
  currentIndex: -1,
  isShuffling: false,
  isRepeating: false,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      originalQueue: songs,
      currentSong: songs[0],
      currentIndex: 0,
    });
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }
    set({
      queue: songs,
      originalQueue: songs,
      currentSong: songs[startIndex],
      currentIndex: startIndex,
      isPlaying: true,
    });
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return;
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },

  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;

    const currentSong = get().currentSong;
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity:
          willStartPlaying && currentSong
            ? `Playing ${currentSong.title} by ${currentSong.artist}`
            : "Idle",
      });
    }
    set({ isPlaying: !get().isPlaying });
  },

  playNext: () => {
    const { isRepeating, currentSong, currentIndex, queue } = get();

    if (isRepeating && currentSong) {
      // 🔁 Repeat current song ngay lập tức
      set({
        currentSong: currentSong,
        isPlaying: true,
      });
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
        });
      }
      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else {
      // Hết bài, không repeat
      set({ isPlaying: false });
      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Idle`,
        });
      }
    }
  },

  playPrevious: () => {
    const { currentIndex, queue } = get();
    const prevIndex = currentIndex - 1;

    // theres a prev song
    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
        });
      }

      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true,
      });
    } else {
      // no prev song
      set({ isPlaying: false });

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Idle`,
        });
      }
    }
  },

  toggleShuffle: () => {
    const { isShuffling, originalQueue, currentSong } = get();

    if (isShuffling) {
      // 🔁 Turn OFF shuffle: restore original queue
      const index = originalQueue.findIndex((s) => s._id === currentSong?._id);
      set({
        isShuffling: false,
        queue: originalQueue,
        currentIndex: index !== -1 ? index : 0,
      });
    } else {
      // 🔀 Turn ON shuffle
      const shuffledQueue = [...originalQueue];
      for (let i = shuffledQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQueue[i], shuffledQueue[j]] = [
          shuffledQueue[j],
          shuffledQueue[i],
        ];
      }
      const index = shuffledQueue.findIndex((s) => s._id === currentSong?._id);
      set({
        isShuffling: true,
        queue: shuffledQueue,
        currentIndex: index !== -1 ? index : 0,
      });
    }
  },
  toggleRepeat: () => {
    set({ isRepeating: !get().isRepeating });
  },
}));
