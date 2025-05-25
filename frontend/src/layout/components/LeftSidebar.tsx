import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn, useAuth } from "@clerk/clerk-react";
import {
  HomeIcon,
  Library,
  MessageCircle,
  Search,
  Album,
  Music,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
  const { allAlbums, playlists, fetchAlbums, fetchPlaylists, isLoading } =
    useMusicStore();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    fetchAlbums();
    if (isSignedIn) {
      fetchPlaylists();
    }
  }, [fetchAlbums, fetchPlaylists, isSignedIn]);

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="rounded-lg bg-zinc-900 p-4">
        <Link
          to={"/"}
          className={cn(
            buttonVariants({
              variant: "ghost",
              className: "w-full justify-start text-white hover:bg-zinc-800",
            })
          )}
        >
          <HomeIcon className="mr-2 size-5" />
          <span className="hidden md:inline">Home</span>
        </Link>

        <Link
          to={"/search"}
          className={cn(
            buttonVariants({
              variant: "ghost",
              className: "w-full justify-start text-white hover:bg-zinc-800",
            })
          )}
        >
          <Search className="mr-2 size-5" />
          <span className="hidden md:inline">Search</span>
        </Link>

        <SignedIn>
          <Link
            to={"/chat"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800",
              })
            )}
          >
            <MessageCircle className="mr-2 size-5" />
            <span className="hidden md:inline">Messages</span>
          </Link>
        </SignedIn>
      </div>

      <div className="flex-1 rounded-lg bg-zinc-900 z-4">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center text-white">
            <Library className="size-5 mr-2" />
            <span className="hidden md:inline">Your Library</span>
          </div>
        </div>
        <Tabs defaultValue="playlists" className="space-y-4 px-2">
          <TabsList className="p-1 bg-zinc-800/50">
            <TabsTrigger
              value="playlists"
              className="data-[state=active]:bg-zinc-700"
            >
              <Music className="mr-2 size-4" />
              Playlists
            </TabsTrigger>
            <TabsTrigger
              value="albums"
              className="data-[state=active]:bg-zinc-700"
            >
              <Album className="mr-2 size-4" />
              Albums
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playlists">
            <SignedIn>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-2">
                  {isLoading ? (
                    <PlaylistSkeleton />
                  ) : playlists.length > 0 ? (
                    playlists.map((playlist) => (
                      <Link
                        to={`/playlists/${playlist._id}`}
                        key={playlist._id}
                        className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                      >
                        <img
                          src={playlist.imageUrl || "/default-playlist.png"}
                          alt="Playlist img"
                          className="size-12 rounded-md flex-shrink-0 object-cover"
                        />
                        <div className="flex-1 min-w-0 hidden md:block">
                          <p className="font-medium truncate">
                            {playlist.title}
                          </p>
                          <p className="text-sm text-zinc-400 truncate">
                            Playlist •{" "}
                            {(playlist.creator as any)?.fullName || "You"}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-zinc-400 text-sm">No playlists yet.</p>
                  )}
                </div>
              </ScrollArea>
            </SignedIn>
            {!isSignedIn && (
              <p className="text-zinc-400 text-sm px-2">
                Sign in to view your playlists.
              </p>
            )}
          </TabsContent>

          <TabsContent value="albums">
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-2">
                {isLoading ? (
                  <PlaylistSkeleton />
                ) : allAlbums.length > 0 ? (
                  allAlbums.map((album) => (
                    <Link
                      to={`/albums/${album._id}`}
                      key={album._id}
                      className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                    >
                      <img
                        src={album.imageUrl}
                        alt="Album img"
                        className="size-12 rounded-md flex-shrink-0 object-cover"
                      />
                      <div className="flex-1 min-w-0 hidden md:block">
                        <p className="font-medium truncate">{album.title}</p>
                        <p className="text-sm text-zinc-400 truncate">
                          Album • {album.artist}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-zinc-400 text-sm">No albums available.</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LeftSidebar;
