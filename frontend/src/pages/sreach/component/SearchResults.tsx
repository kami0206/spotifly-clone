import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import PlayButton from "@/pages/home/components/PlayButton";

interface SearchResultsProps {
  songs: any[];
  albums: any[];
  isLoading: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  songs,
  albums,
  isLoading,
}) => {
  if (isLoading) return <PlaylistSkeleton />;

  if ((!songs || songs.length === 0) && (!albums || albums.length === 0)) {
    return <p className="text-zinc-400 mt-6 text-center">No results found.</p>;
  }

  return (
    <div className="mt-6 space-y-8">
      {/* Songs */}
      {songs && songs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Songs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {songs.map((song) => (
              <div
                key={song._id}
                className="flex items-center bg-zinc-800/50 rounded-md overflow-hidden hover:bg-zinc-700/50 transition-colors group cursor-pointer relative"
              >
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0"
                />
                <div className="flex-1 p-4">
                  <p className="font-medium truncate">{song.title}</p>
                  <p className="text-sm text-zinc-400 truncate">
                    {song.artist}
                  </p>
                </div>
                <PlayButton song={song} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Albums */}
      {albums && albums.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Albums</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {albums.map((album) => (
              <div
                key={album._id}
                className="flex items-center bg-zinc-800/50 rounded-md overflow-hidden hover:bg-zinc-700/50 transition-colors group cursor-pointer relative"
              >
                <img
                  src={album.imageUrl}
                  alt={album.title}
                  className="w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0"
                />
                <div className="flex-1 p-4">
                  <p className="font-medium truncate">{album.title}</p>
                  <p className="text-sm text-zinc-400 truncate">
                    {album.artist}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Release Year: {album.releaseYear}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
