import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom"; // ✅ cần có react-router

interface AlbumResultsProps {
  albums: any[];
  isLoading: boolean;
}

const AlbumResults: React.FC<AlbumResultsProps> = ({ albums, isLoading }) => {
  if (isLoading)
    return <p className="text-center text-zinc-400">Loading albums...</p>;

  if (!albums || albums.length === 0) {
    return <p className="text-center text-zinc-400">No albums found.</p>;
  }

  return (
    <div className="space-y-2">
      {isLoading ? (
        <PlaylistSkeleton />
      ) : (
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-2">
            {albums.map((album) => (
              <Link
                to={`/albums/${album._id}`}
                key={album._id}
                className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
              >
                <img
                  src={album.imageUrl}
                  alt="Playlist img"
                  className="size-12 rounded-md flex-shrink-0 object-cover"
                />
                <div className="flex-1 min-w-0 hidden md:block">
                  <p className="font-medium truncate">{album.title}</p>
                  <p className="text-sm text-zinc-400 truncate">
                    Album • {album.artist}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default AlbumResults;
