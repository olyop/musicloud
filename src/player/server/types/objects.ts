import {
	KeyBase,
	UserBase,
	PlayBase,
	SongBase,
	AlbumBase,
	GenreBase,
	KeyIDBase,
	UserIDBase,
	ArtistBase,
	SongIDBase,
	AlbumIDBase,
	PlaylistBase,
	PlaylistIDBase,
} from "@oly_op/music-app-common/types"

export type Key =
	KeyBase

export interface UserNowPlaying {
	nowPlaying: string | null,
}

export interface User extends UserNowPlaying, UserBase {
	password: string,
	queueNext?: string[],
	queueLater?: string[],
	queuePrevious: string[],
}

export interface Album extends AlbumBase {
	released: Date,
}

export interface Genre extends GenreBase {}

export interface Artist extends ArtistBase {}

export interface Playlist extends UserIDBase, PlaylistBase {}

export interface Play extends PlayBase, UserIDBase, SongIDBase {}

export interface Song extends SongBase, KeyIDBase, AlbumIDBase {
	queueIndex: number | null,
}

export interface LibraryObject extends UserIDBase {
	dateAdded: number,
	inLibrary: boolean,
}

export interface QueueSong extends UserIDBase, SongIDBase {
	index: number,
}

export interface PlaylistSong extends SongIDBase, PlaylistIDBase {
	index: number,
	dateAdded: number,
}