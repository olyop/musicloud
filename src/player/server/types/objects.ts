import {
	KeyBase,
	UserBase,
	PlayBase,
	SongBase,
	AlbumBase,
	GenreBase,
	KeyID,
	UserID,
	ArtistBase,
	SongID,
	AlbumID,
	PlaylistBase,
	PlaylistID,
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

export interface Artist extends ArtistBase {
	city: string,
	country: string,
}

export interface Playlist extends UserID, PlaylistBase {}

export interface Play extends PlayBase, UserID, SongID {}

export interface Song extends SongBase, KeyID, AlbumID {
	queueIndex: number | null,
}

export interface LibraryObject extends UserID {
	dateAdded: number,
	inLibrary: boolean,
}

export interface QueueSong extends UserID, SongID {
	index: number,
}

export interface NowPlaying extends UserID, SongID {}

export interface QueueNowPlaying {
	nowPlaying: NowPlaying | null,
}

export interface Queue extends QueueNowPlaying {
	next: QueueSong[] | null,
	later: QueueSong[] | null,
	previous: QueueSong[] | null,
}

export interface PlaylistSong extends SongID, PlaylistID {
	index: number,
	dateAdded: number,
}

export type Search =
	User | Song | Genre | Album | Artist | Playlist