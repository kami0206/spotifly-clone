import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
  const { albumId } = useParams<{ albumId: string }>(); // Explicitly type useParams
  const {
    fetchAlbumById,
    currentAlbum,
    isLoading,
    playlists,
    createOrUpdatePlaylist,
    error,
  } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    songId: string | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    songId: null,
  });

  useEffect(() => {
    if (albumId) {
      fetchAlbumById(albumId);
    } else {
      console.error("Không có albumId trong URL");
      toast.error("Không tìm thấy ID album");
    }
  }, [fetchAlbumById, albumId]);

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!currentAlbum) return <div>Không tìm thấy album</div>;

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    const isCurrentAlbumPlaying = currentAlbum.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentAlbumPlaying) {
      togglePlay();
    } else {
      playAlbum(currentAlbum.songs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (!currentAlbum) return;
    playAlbum(currentAlbum.songs, index);
  };

  const handleContextMenu = (event: React.MouseEvent, songId: string) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.pageX,
      y: event.pageY,
      songId,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, songId: null });
  };

  const handleShare = (songId: string) => {
    const song = currentAlbum?.songs.find((s) => s._id === songId);
    if (song) {
      const link = `${window.location.origin}/songs/${songId}`;
      navigator.clipboard.writeText(link);
      toast.success("Đã sao chép liên kết bài hát!");
    } else {
      toast.error("Không tìm thấy bài hát!");
    }
    handleCloseContextMenu();
  };

  const handleCreateNewPlaylist = async (songId: string) => {
    if (!songId) return;
    const title = prompt("Nhập tên playlist mới:");
    if (!title) {
      toast.error("Tên playlist không được để trống!");
      return;
    }
    try {
      const newPlaylist = await createOrUpdatePlaylist(title, undefined, [
        songId,
      ]);
      if (newPlaylist) {
        toast.success("Playlist mới được tạo!");
      }
    } catch {
      toast.error("Lỗi khi tạo playlist!");
    }
    handleCloseContextMenu();
  };

  const handleAddToExistingPlaylist = async (songId: string) => {
    if (!songId) return;
    const playlistTitle = prompt(
      "Nhập tên playlist để thêm vào (hoặc tạo mới):"
    );
    if (!playlistTitle) {
      toast.error("Tên playlist không được để trống!");
      return;
    }
    try {
      const playlist = playlists.find((p) => p.title === playlistTitle);
      const updatedPlaylist = await createOrUpdatePlaylist(
        playlistTitle,
        undefined,
        [songId]
      );
      if (updatedPlaylist) {
        if (!playlist) {
          toast.success("Playlist mới được tạo và bài hát đã được thêm!");
        } else {
          toast.success("Bài hát đã được thêm vào playlist!");
        }
      }
    } catch {
      toast.error("Lỗi khi thêm bài hát vào playlist!");
    }
    handleCloseContextMenu();
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
                src={currentAlbum.imageUrl || "/placeholder-image.png"} // Fallback image
                alt={currentAlbum.title || "Album"}
                className="w-[240px] h-[240px] shadow-xl rounded"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Danh sách nhạc</p>
                <h1 className="text-7xl font-bold my-4">
                  {currentAlbum.title || "Không có tiêu đề"}
                </h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">
                    {currentAlbum.artist || "Không rõ nghệ sĩ"}
                  </span>
                  <span>• {currentAlbum.songs.length} bài hát</span>
                  <span>• {currentAlbum.releaseYear || "N/A"}</span>
                </div>
              </div>
            </div>
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
                disabled={!currentAlbum}
              >
                {currentAlbum.songs.some(
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
                  {currentAlbum.songs.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(index)}
                        onContextMenu={(e) => handleContextMenu(e, song._id)}
                        className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
                      >
                        <div className="flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <div className="size-4 text-green-500">♫</div>
                          ) : (
                            <span className="group-hover:hidden">
                              {index + 1}
                            </span>
                          )}
                          {!isCurrentSong && (
                            <Play className="h-4 w-4 hidden group-hover:block" />
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <img
                            src={song.imageUrl || "/placeholder-image.png"} // Fallback image
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
                          {song.createdAt.split("T")[0]}
                        </div>
                        <div className="flex items-center gap-4">
                          <span>{formatDuration(song.duration)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              const link = `${window.location.origin}/songs/${song._id}`;
                              navigator.clipboard.writeText(link);
                              toast.success("Đã sao chép liên kết bài hát!");
                            }}
                            className="text-zinc-400 hover:text-white"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {contextMenu.visible && contextMenu.songId && (
        <div
          className="fixed bg-zinc-800 text-white rounded-md shadow-lg p-2 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={handleCloseContextMenu}
          onContextMenu={handleCloseContextMenu}
        >
          <ul className="space-y-1">
            <li
              className="cursor-pointer hover:bg-zinc-700 p-2 rounded"
              onClick={() => handleShare(contextMenu.songId!)}
            >
              Chia sẻ
            </li>
            <li
              className="cursor-pointer hover:bg-zinc-700 p-2 rounded"
              onClick={() => handleCreateNewPlaylist(contextMenu.songId!)}
            >
              Thêm vào Playlist Mới
            </li>
            <li
              className="cursor-pointer hover:bg-zinc-700 p-2 rounded"
              onClick={() => handleAddToExistingPlaylist(contextMenu.songId!)}
            >
              Thêm vào Playlist Hiện Có
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AlbumPage;
