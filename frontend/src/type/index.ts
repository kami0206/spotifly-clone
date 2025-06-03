export interface Song {
  _id: string;
  title: string;
  artist: string;
  albumId: string | null;
  imageUrl: string;
  audioUrl: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  releaseYear: number;
  songs: Song[];
}

export interface Stats {
  totalSongs: number;
  totalAlbums: number;
  totalUsers: number;
  totalArtists: number;
}
export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
export interface User {
  _id: string;
  clerkId: string;
  fullName: string;
  imageUrl: string;
}

export interface Playlist {
  _id: string;
  title: string;
  imageUrl?: string;
  creator: string | { _id: string; fullName: string };
  songs: Song[];
  description?: string; // Add this field here
}
