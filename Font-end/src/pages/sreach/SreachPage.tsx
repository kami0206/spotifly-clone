import { useEffect, useState } from "react";
import SearchHeader from "./component/SreachHeader";
import SearchResults from "./component/SearchResults";
import { useMusicStore } from "@/stores/useMusicStore";

const SreachPage = () => {
  const [query, setQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState<any[]>([]);
  const { featuredSongs } = useMusicStore();

  // 👇 Add loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!query) {
      setFilteredSongs([]);
    } else {
      const filtered = featuredSongs.filter((song) =>
        song.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  }, [query, featuredSongs]);

  return (
    <div className="min-h-screen bg-black px-4 py-6 text-white flex flex-col items-center">
      <div className="w-full max-w-xl mb-6">
        <SearchHeader onSearch={setQuery} />
      </div>

      {/* Render search results directly under the search bar */}
      {query && (
        <div className="w-full max-w-6xl mt-4">
          <SearchResults songs={filteredSongs} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default SreachPage;
