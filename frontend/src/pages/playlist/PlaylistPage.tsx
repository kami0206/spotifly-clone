import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import ContextMenu from "@/components/ContextMenu";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PlaylistPage = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { fetchPlaylistById, currentPlaylist, isLoading, error } =
    useMusicStore();
  const { currentSong, isPlaying, playPlaylist, togglePlay } = usePlayerStore();

  useEffect(() => {
    if (playlistId) {
      fetchPlaylistById(playlistId);
    } else {
      console.error("Không có playlistId trong URL");
      toast.error("Không tìm thấy ID playlist");
    }
  }, [fetchPlaylistById, playlistId]);

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!currentPlaylist) return <div>Không tìm thấy playlist</div>;

  const handlePlayPlaylist = () => {
    if (!currentPlaylist) return;

    const isCurrentPlaylistPlaying = currentPlaylist.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentPlaylistPlaying) {
      togglePlay();
    } else {
      playPlaylist(currentPlaylist.songs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (!currentPlaylist) return;
    playPlaylist(currentPlaylist.songs, index);
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        <div className="relative min-h-full">
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <img
                src={currentPlaylist.imageUrl || "/placeholder-image.png"}
                alt={currentPlaylist.title || "Playlist"}
                className="w-[240px] h-[240px] shadow-xl rounded"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Danh sách phát</p>
                <h1 className="text-7xl font-bold my-4">
                  {currentPlaylist.title || "Không có tiêu đề"}
                </h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">
                    {typeof currentPlaylist.creator === "string"
                      ? currentPlaylist.creator
                      : currentPlaylist.creator?.fullName ||
                        "Không rõ người tạo"}
                  </span>
                  <span>• Playlist</span>
                  <span>• {currentPlaylist.songs.length} bài hát</span>
                </div>
              </div>
            </div>
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={handlePlayPlaylist}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
                disabled={!currentPlaylist}
              >
                {currentPlaylist.songs.some(
                  (song) => song._id === currentSong?._id
                ) && isPlaying ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>
            </div>
            <div className="bg-black/20 backdrop-blur-sm">
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Tiêu đề</div>
                <div>Ngày phát hành</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentPlaylist.songs.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <ContextMenu
                        key={`${song._id}-${index}`} // ✅ UNIQUE key
                        itemType="song"
                        itemId={song._id}
                        itemTitle={song.title}
                        isInPlaylist={true}
                        playlistId={currentPlaylist._id}
                      >
                        <div
                          onClick={() => handlePlaySong(index)}
                          className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
                        >
                          <div className="flex items-center justify-center">
                            {isCurrentSong && isPlaying ? (
                              <div className="size-4 text-green-500">♫</div>
                            ) : (
                              <>
                                <span className="group-hover:hidden">
                                  {index + 1}
                                </span>
                                {!isCurrentSong && (
                                  <Play className="h-4 w-4 hidden group-hover:block" />
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <img
                              src={song.imageUrl || "/placeholder-image.png"}
                              alt={song.title}
                              className="size-10"
                            />
                            <div>
                              <div className="font-medium text-white">
                                {song.title}
                              </div>
                              <div>{song.artist}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {song.createdAt?.split("T")[0]}
                          </div>
                          <div className="flex items-center gap-4">
                            <span>{formatDuration(song.duration)}</span>
                          </div>
                        </div>
                      </ContextMenu>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlaylistPage;
