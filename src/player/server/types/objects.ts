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

export interface User extends UserBase {
	password: string,
}

export interface Album extends AlbumBase {
	released: Date,
}

export type Genre =
	GenreBase

export type Artist =
	ArtistBase

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

export interface NowPlaying extends UserIDBase, SongIDBase {}

export interface QueueNowPlaying {
	nowPlaying: NowPlaying | null,
}

export interface Queue extends QueueNowPlaying {
	next: QueueSong[] | null,
	later: QueueSong[] | null,
	previous: QueueSong[] | null,
}

export interface PlaylistSong extends SongIDBase, PlaylistIDBase {
	index: number,
	dateAdded: number,
}

export type Search =
	User | Song | Genre | Album | Artist | Playlist