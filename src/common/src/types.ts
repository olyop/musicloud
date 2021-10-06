export interface ObjectIDBase {
	objectID: string,
}

export interface KeyIDBase {
	keyID: string,
}

export interface UserIDBase {
	userID: string,
}

export interface SongIDBase {
	songID: string,
}

export interface PlayIDBase {
	playID: string,
}

export interface AlbumIDBase {
	albumID: string,
}

export interface GenreIDBase {
	genreID: string,
}

export interface ArtistIDBase {
	artistID: string,
}

export interface PlaylistIDBase {
	playlistID: string,
}

export interface KeyBase extends KeyIDBase {
	flat: string,
	sharp: string,
	camelot: string,
}

export interface UserBase extends UserIDBase {
	name: string,
	dateJoined: number,
}

export interface SongBase extends SongIDBase {
	mix: string,
	bpm: string,
	title: string,
	duration: number,
	discNumber: number,
	trackNumber: number,
}

export interface PlayBase extends PlayIDBase {
	dateCreated: number,
}

export interface AlbumBase extends AlbumIDBase {
	title: string,
}

export interface GenreBase extends GenreIDBase {
	name: string,
}

export interface ArtistBase extends ArtistIDBase {
	name: string,
}

export interface PlaylistBase extends PlaylistIDBase {
	title: string,
	dateCreated: number,
}

export interface InterfaceWithInput<T> {
	input: T,
}

export interface InterfaceWithPartialInput<T> {
	input?: T,
}

export enum ImageSizes {
	MINI = "mini",
	HALF = "half",
	FULL = "full",
}

export enum ImageDimensions {
	SQUARE = "square",
	LANDSCAPE = "landscape",
}

export interface ImageInput {
	name: string,
	size: ImageSizes,
	dimension: ImageDimensions,
}