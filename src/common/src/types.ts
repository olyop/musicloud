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

export interface KeyBase extends KeyID {
	flat: string,
	sharp: string,
	camelot: string,
}

export interface UserBase extends UserID {
	name: string,
	dateJoined: number,
}

export interface SongBase extends SongID {
	mix: string,
	bpm: string,
	title: string,
	duration: number,
	discNumber: number,
	trackNumber: number,
}

export interface PlayBase extends PlayID {
	dateCreated: number,
}

export interface AlbumBase extends AlbumID {
	title: string,
}

export interface GenreBase extends GenreID {
	name: string,
}

export interface ArtistBase extends ArtistID {
	name: string,
}

export interface PlaylistBase extends PlaylistID {
	title: string,
	isPublic: boolean,
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