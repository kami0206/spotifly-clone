import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import { useMusicStore } from "@/stores/useMusicStore";

interface ContextMenuProps {
  itemType: "playlist" | "song" | "album";
  itemId: string;
  itemTitle: string;
  isInPlaylist?: boolean;
  playlistId?: string; // Optional prop for playlist ID
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  itemType,
  itemId,
  itemTitle,
  isInPlaylist = false,
  playlistId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { playlists, removeSongsFromPlaylist, createOrUpdatePlaylist } =
    useMusicStore();

  // Handle right-click to open context menu (using e)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  };

  // Handle hover to open "Thêm" dropdown for non-playlist items (no e needed)
  const handleHover = () => {
    if (!isInPlaylist) {
      setIsOpen(true);
    }
  };

  const handleRemoveFromPlaylist = async () => {
    if (itemType === "song" && isInPlaylist) {
      try {
        const pid = playlistId || useMusicStore.getState().currentPlaylist?._id;
        if (!pid) throw new Error("Không tìm thấy playlist");
        await removeSongsFromPlaylist(pid, [itemId]);
        toast.success("Xóa bài hát khỏi danh sách phát thành công");
      } catch  {
        toast.error("Lỗi khi xóa bài hát");
      }
    }
    setIsOpen(false);
  };

  const handleAddToPlaylist = async (playlistId?: string) => {
    if (!playlistId) {
      const newPlaylistTitle = prompt("Nhập tên playlist mới:");
      if (newPlaylistTitle) {
        await createOrUpdatePlaylist(newPlaylistTitle, undefined, [itemId]);
        toast.success("Tạo playlist mới thành công");
      }
    } else {
      const playlist = playlists.find((p) => p._id === playlistId);
      if (playlist) {
        await createOrUpdatePlaylist(playlist.title, playlist.imageUrl, [
          ...playlist.songs.map((s) => s._id),
          itemId,
        ]);
        toast.success("Thêm vào playlist thành công");
      }
    }
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div
          onContextMenu={handleContextMenu}
          onMouseEnter={handleHover}
          onMouseLeave={() => setIsOpen(false)}
          className="relative cursor-pointer p-2 hover:bg-gray-700 rounded text-white"
        >
          {itemTitle}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 p-1 bg-gray-800 border border-gray-600 shadow-lg rounded-md text-white">
        {isInPlaylist && itemType === "song" && (
          <DropdownMenuItem
            onClick={handleRemoveFromPlaylist}
            className="text-red-400 hover:bg-gray-700"
          >
            Xóa
          </DropdownMenuItem>
        )}
        {!isInPlaylist && (
          <>
            <DropdownMenuItem
              onClick={() => handleAddToPlaylist()}
              className="hover:bg-gray-700"
            >
              Thêm vào danh sách phát mới
            </DropdownMenuItem>
            {playlists.map((playlist) => (
              <DropdownMenuItem
                key={playlist._id}
                onClick={() => handleAddToPlaylist(playlist._id)}
                className="hover:bg-gray-700"
              >
                Thêm vào {playlist.title}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContextMenu;
