export interface ObjectID {
	objectID: string,
}

export interface KeyID {
	keyID: string,
}

export interface UserID {
	userID: string,
}

export interface SongID {
	songID: string,
}

export interface PlayID {
	playID: string,
}

export interface AlbumID {
	albumID: string,
}

export interface GenreID {
	genreID: string,
}

export interface ArtistID {
	artistID: string,
}

export interface PlaylistID {
	playlistID: string,
}

export interface KeyBase
	extends KeyID {
	flat: string,
	sharp: string,
	camelot: string,
}

export interface NameBase {
	name: string,
}

export interface TitleBase {
	title: string,
}

export interface DateCreatedBase {
	dateCreated: number,
}

export interface UserIDNameBase
	extends UserID, NameBase {}

export interface UserDateJoinedBase {
	dateJoined: number,
}

export interface UserEmailAddress {
	emailAddress: string,
}

export interface UserIDNameEmailAddressBase
	extends UserIDNameBase, UserEmailAddress {}

export interface UserBase
	extends
	UserDateJoinedBase,
	UserIDNameEmailAddressBase {}

export interface SongIDTitleBase
	extends SongID, TitleBase {}

export interface SongBase
	extends SongIDTitleBase {
	mix: string,
	bpm: string,
	duration: number,
	discNumber: number,
	trackNumber: number,
}

export interface PlayBase
	extends PlayID, DateCreatedBase {}

export interface AlbumIDTitleBase
	extends AlbumID, TitleBase {}

export type AlbumBase =
	AlbumIDTitleBase

export interface GenreIDNameBase
	extends GenreID, NameBase {}

export type GenreBase =
	GenreIDNameBase

export interface ArtistIDNameBase
	extends ArtistID, NameBase {}

export type ArtistBase =
	ArtistIDNameBase

export enum PlaylistPrivacy {
	PUBLIC = "PUBLIC",
	PRIVATE = "PRIVATE",
	FOLLOWERS = "FOLLOWERS",
}

export interface PlaylistIDTitleBase
	extends PlaylistID, TitleBase {}

export interface PlaylistBase
	extends
	DateCreatedBase,
	PlaylistIDTitleBase {
	privacy: PlaylistPrivacy,
}

export type TypeNames =
	"Key" | "User" | "Play" | "Song" | "Genre" | "Album" | "Artist" | "Playlist"