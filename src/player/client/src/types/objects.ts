/* eslint-disable @typescript-eslint/indent */
import {
	UserID,
	KeyBase,
	UserBase,
	PlayBase,
	SongBase,
	AlbumBase,
	GenreBase,
	ArtistBase,
	PlaylistBase,
} from "@oly_op/musicloud-common/build/types";

export interface StoreObject<T = string> {
	__typename: T;
}

export interface Key extends KeyBase, StoreObject<"Key"> {}

export interface InLibraryBase {
	inLibrary: boolean;
}

export interface UserClientBase extends StoreObject<"User">, UserID {
	isFollower: boolean;
	isFollowing: boolean;
	followers: User[] | null;
}

export interface UserPlaylists {
	playlists: Playlist[];
	playlistsFilteredBySong: Playlist[];
}

export interface User extends UserBase, UserPlaylists, UserClientBase {}

export interface Play extends PlayBase, StoreObject<"Play"> {
	user: User;
	song: Song;
}

export interface LibraryObject<T> extends StoreObject<T> {
	userPlays: Play[] | null;
	playsTotal: number | null;
	userPlaysTotal: number | null;
}

export interface Genre extends GenreBase, LibraryObject<"Genre"> {
	songs: Song[];
	songsTotal: number | null;
	albumsTotal: number | null;
}

export interface Album extends AlbumBase, InLibraryBase, LibraryObject<"Album"> {
	songs: Song[];
	genres: Genre[];
	duration: number;
	released: string;
	artists: Artist[];
	songsTotal: number;
	remixers: Artist[];
}

export interface InLibraryObject<T> extends InLibraryBase, LibraryObject<T> {
	dateAddedToLibrary: number | null;
}

export interface ArtistSongs {
	songs: Song[];
}

export interface ArtistTopTenSongs {
	topTenSongs: Song[];
}

export interface Artist
	extends ArtistBase,
		ArtistSongs,
		ArtistTopTenSongs,
		InLibraryObject<"Artist"> {
	since: string;
	albums: Album[];
	songsTotal: number;
	albumsTotal: number;
	city: string | null;
	country: string | null;
}

export interface SongQueueIndex {
	queueIndex: number | null;
}

export interface SongPlaylistIndex {
	playlistIndex: number | null;
}

export interface Song extends SongBase, SongQueueIndex, SongPlaylistIndex, InLibraryObject<"Song"> {
	key: Key;
	size: number;
	album: Album;
	genres: Genre[];
	artists: Artist[];
	remixers: Artist[];
	featuring: Artist[];
	isInPlaylist: boolean;
	dateAddedToPlaylist: number | null;
}

export interface Playlist extends PlaylistBase, InLibraryObject<"Playlist"> {
	user: User;
	songs: Song[];
	songsTotal: number | null;
	playlistIndex: number | null;
}

type QueueBase = StoreObject<"Queue">;

export interface QueueNext extends QueueBase {
	next: Song[] | null;
}

export interface QueueLater extends QueueBase {
	later: Song[] | null;
}

export interface QueuePrevious extends QueueBase {
	previous: Song[] | null;
}

export interface QueueNextLater extends QueueBase, QueueNext, QueueLater {}

export interface QueuePreviousNextLater extends QueueBase, QueuePrevious, QueueNextLater {}

export interface QueueNowPlaying extends QueueBase {
	nowPlaying: Song | null;
}

export interface Queue extends StoreObject<"Queue">, QueuePreviousNextLater, QueueNowPlaying {}

type LibraryBase = StoreObject<"Library">;

export interface LibraryDuration extends LibraryBase {
	duration: number;
}

export interface LibrarySongsTotal extends LibraryBase {
	songsTotal: number | null;
}

export interface LibraryGenresTotal extends LibraryBase {
	genresTotal: number | null;
}

export interface LibraryAlbumsTotal extends LibraryBase {
	albumsTotal: number | null;
}

export interface LibraryArtistsTotal extends LibraryBase {
	artistsTotal: number | null;
}

export interface LibraryPlaylistsTotal extends LibraryBase {
	playlistsTotal: number | null;
}

export interface LibrarySongsAtIndex extends LibraryBase {
	songsAtIndex: Song[] | null;
}

export interface LibraryGenresAtIndex extends LibraryBase {
	genresAtIndex: Genre[] | null;
}

export interface LibraryAlbumsAtIndex extends LibraryBase {
	albumsAtIndex: Album[] | null;
}

export interface LibraryArtistsAtIndex extends LibraryBase {
	artistsAtIndex: Artist[] | null;
}

export interface LibraryPlaylistsAtIndex extends LibraryBase {
	playlistsAtIndex: Playlist[] | null;
}

export interface Library
	extends LibraryBase,
		LibraryDuration,
		LibrarySongsTotal,
		LibraryGenresTotal,
		LibraryAlbumsTotal,
		LibraryArtistsTotal,
		LibrarySongsAtIndex,
		LibraryGenresAtIndex,
		LibraryAlbumsAtIndex,
		LibraryArtistsAtIndex,
		LibraryPlaylistsTotal,
		LibraryPlaylistsAtIndex {}
