import {
	AlbumBase,
	AlbumID,
	ArtistBase,
	GenreBase,
	KeyBase,
	KeyID,
	PlayBase,
	PlaylistBase,
	PlaylistID,
	SongBase,
	SongID,
	UserBase,
	UserID,
} from "@oly_op/musicloud-common/build/types";

export type Key = KeyBase;

export type User = UserBase;

export interface Album extends AlbumBase {
	released: Date;
}

export type Genre = GenreBase;

export interface Artist extends ArtistBase {
	city: string | null;
	country: string | null;
}

export interface Playlist extends UserID, PlaylistBase {}

export interface Play extends PlayBase, UserID, SongID {}

export interface Song extends SongBase, KeyID, AlbumID {
	queueIndex: number | null;
}

export interface LibraryObject extends UserID {
	dateAdded: number;
	inLibrary: boolean;
}

export interface QueueSong extends UserID, SongID {
	index: number;
}

export interface NowPlaying extends UserID, SongID {}

export interface QueueNowPlaying {
	nowPlaying: NowPlaying | null;
}

export interface Queue extends QueueNowPlaying {
	next: QueueSong[] | null;
	later: QueueSong[] | null;
	previous: QueueSong[] | null;
}

export interface PlaylistSong extends SongID, PlaylistID {
	index: number;
	dateAdded: number;
}

export type Search = User | Song | Genre | Album | Artist | Playlist;
