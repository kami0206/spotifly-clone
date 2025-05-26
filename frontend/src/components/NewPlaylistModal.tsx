import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface NewPlaylistModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (title: string) => Promise<void>;
}

const NewPlaylistModal: React.FC<NewPlaylistModalProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!playlistTitle.trim()) {
      toast.error("Tên playlist không được để trống");
      return;
    }
    if (isSubmitting) {
      console.log("Submit prevented, already submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Creating playlist with title:", playlistTitle);
      await onCreate(playlistTitle);
      setPlaylistTitle("");
      onClose();
      toast.success("Tạo playlist thành công");
    } catch (error) {
      console.error("Error in handleCreate:", error);
      toast.error("Lỗi khi tạo playlist");
    } finally {
      console.log("Resetting isSubmitting");
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) {
      console.log("Cannot close modal, submitting in progress");
      return;
    }
    setPlaylistTitle("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        console.log("onOpenChange called with isOpen:", isOpen);
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle>Tạo playlist mới</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            value={playlistTitle}
            onChange={(e) => setPlaylistTitle(e.target.value)}
            placeholder="Nhập tên playlist"
            className="bg-zinc-800 text-white border-gray-600"
            disabled={isSubmitting}
          />
        </div>
        <DialogFooter className=" gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-gray-600 text-white hover:bg-zinc-700"
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang tạo..." : "Tạo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewPlaylistModal;
