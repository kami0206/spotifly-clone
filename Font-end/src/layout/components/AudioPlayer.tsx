import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);
  const { currentSong, isPlaying, playNext } = usePlayerStore();

  // handle play/pause logic
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  // handle song ends
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      if (usePlayerStore.getState().isRepeating) {
        const audio = audioRef.current;
        if (audio) {
          audio.currentTime = 0;
          audio.play();
          usePlayerStore.setState({ isPlaying: true }); // 🔧 Cập nhật lại state
        }
      } else {
        playNext();
      }
    };

    audio?.addEventListener("ended", handleEnded);

    return () => audio?.removeEventListener("ended", handleEnded);
  }, [playNext]);

  useEffect(() => {
    if (!audioRef.current || !currentSong?.audioUrl) return;

    const audio = audioRef.current;

    // Check if this is actually a new song by comparing URLs
    const isSongChange = prevSongRef.current !== currentSong.audioUrl;

    if (isSongChange) {
      audio.src = currentSong.audioUrl; // Update the src with the new song URL
      audio.currentTime = 0; // Reset playback position

      prevSongRef.current = currentSong.audioUrl; // Store the current song URL for comparison

      if (isPlaying) audio.play(); // Auto-play if it's already set to play
    }
  }, [currentSong, isPlaying]);

  return <audio ref={audioRef} />;
};

export default AudioPlayer;
