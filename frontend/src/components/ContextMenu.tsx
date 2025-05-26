import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import { useMusicStore } from "@/stores/useMusicStore";
import NewPlaylistModal from "./NewPlaylistModal";

interface ContextMenuProps {
  itemType: "playlist" | "song" | "album";
  itemId: string;
  itemTitle: string;
  isInPlaylist?: boolean;
  playlistId?: string;
  children?: React.ReactNode;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  itemType,
  itemId,
  isInPlaylist = false,
  playlistId,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const {
    playlists,
    removeSongsFromPlaylist,
    createOrUpdatePlaylist,
    deletePlaylist,
  } = useMusicStore();

  const handleRemoveFromPlaylist = async () => {
    if (itemType === "song" && isInPlaylist) {
      try {
        const pid = playlistId || useMusicStore.getState().currentPlaylist?._id;
        if (!pid) throw new Error("Không tìm thấy playlist");
        await removeSongsFromPlaylist(pid, [itemId]);
        toast.success("Xóa bài hát khỏi danh sách phát thành công");
      } catch (error) {
        console.error("Error in handleRemoveFromPlaylist:", error);
        toast.error("Lỗi khi xóa bài hát");
      }
    }
    setOpen(false);
  };

  const handleAddToPlaylist = async (playlistId?: string) => {
    if (!playlistId) {
      // ✅ Đóng dropdown trước khi mở modal
      setOpen(false);
      setModalOpen(true);
    } else {
      const playlist = playlists.find((p) => p._id === playlistId);
      if (playlist) {
        const existingSongIds = [...new Set(playlist.songs.map((s) => s._id))];
        if (existingSongIds.includes(itemId)) {
          toast.error("Bài hát đã có trong playlist này");
          return;
        }
        try {
          await createOrUpdatePlaylist(playlist.title, playlist.imageUrl, [
            ...existingSongIds,
            itemId,
          ]);
          toast.success("Thêm vào playlist thành công");
        } catch (error) {
          console.error("Error in handleAddToPlaylist:", error);
          toast.error("Lỗi khi thêm bài hát");
        }
      }
      setOpen(false);
    }
  };

  const handleCreatePlaylist = async (title: string) => {
    try {
      console.log("Calling createOrUpdatePlaylist with:", title, itemId);
      await createOrUpdatePlaylist(title, undefined, [itemId]);
      toast.success("Tạo playlist mới thành công");
    } catch (error) {
      console.error("Error in handleCreatePlaylist:", error);
      toast.error("Lỗi khi tạo playlist");
      throw error;
    } finally {
      console.log("Closing modal and context menu");
      setModalOpen(false);
      setOpen(false);
    }
  };

  const handleShare = () => {
    let shareUrl = "";
    switch (itemType) {
      case "song":
        shareUrl = `/songs/${itemId}`;
        break;
      case "playlist":
        shareUrl = `/playlists/${itemId}`;
        break;
      case "album":
        shareUrl = `/albums/${itemId}`;
        break;
      default:
        shareUrl = "/";
    }
    const fullUrl = window.location.origin + shareUrl;
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        toast.success("Đã sao chép liên kết!");
      })
      .catch((err) => {
        console.error("Lỗi khi sao chép vào clipboard:", err);
        toast.error("Lỗi khi chia sẻ");
      });
    setOpen(false);
  };

  const handleDeletePlaylist = async () => {
    if (itemType === "playlist") {
      try {
        await deletePlaylist(itemId);
        toast.success("Xóa playlist thành công");
      } catch (error) {
        console.error("Error in handleDeletePlaylist:", error);
        toast.error("Lỗi khi xóa playlist");
      }
    }
    setOpen(false);
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(false);
  };

  return (
    <>
      <DropdownMenu
        open={open}
        onOpenChange={(newOpen) => {
          if (!newOpen) setOpen(false);
        }}
      >
        <DropdownMenuTrigger asChild>
          <div
            onContextMenu={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
            onClick={handleTriggerClick}
            className="relative"
          >
            {children}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 p-1 bg-gray-800 border border-gray-600 shadow-lg rounded-md text-white">
          {itemType === "playlist" && (
            <DropdownMenuItem
              onClick={handleDeletePlaylist}
              className="text-red-400 hover:bg-gray-700"
            >
              Xóa playlist
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={handleShare}
            className="hover:bg-gray-700 text-blue-400"
          >
            Chia sẻ
          </DropdownMenuItem>
          {itemType === "song" && (
            <>
              {isInPlaylist && (
                <DropdownMenuItem
                  onClick={handleRemoveFromPlaylist}
                  className="text-red-400 hover:bg-gray-700"
                >
                  Xóa khỏi playlist
                </DropdownMenuItem>
              )}
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

      {/* Modal */}
      {itemType === "song" && (
        <NewPlaylistModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreatePlaylist}
        />
      )}
    </>
  );
};

export default ContextMenu;
