import { PlaylistPrivacy } from "./enums"

import {
	KeyID,
	PlayID,
	SongID,
	UserID,
	AlbumID,
	GenreID,
	ArtistID,
	PlaylistID,
} from "./ids"

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

export interface UserPasswordBase {
	password: string,
}

export interface UserDateJoinedBase {
	dateJoined: number,
}

export interface UserEmailAddressBase {
	emailAddress: string,
}

export interface UserIDNameEmailAddressBase
	extends UserIDNameBase, UserEmailAddressBase {}

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

export interface PlaylistIDTitleBase
	extends PlaylistID, TitleBase {}

export interface PlaylistBase
	extends
	DateCreatedBase,
	PlaylistIDTitleBase {
	privacy: PlaylistPrivacy,
}