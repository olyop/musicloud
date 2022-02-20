import {
	ObjectID,
	UserBase,
	SongBase,
	GenreBase,
	AlbumBase,
	TypeNames,
	ArtistBase,
	PlaylistBase,
	UserIDNameBase,
	GenreIDNameBase,
	AlbumIDTitleBase,
	ArtistIDNameBase,
} from "./objects"

export type AlgoliaRecordTypeName =
	Exclude<TypeNames, "Key" | "Play">

export interface AlgoliaRecordTypeNameBase<T extends AlgoliaRecordTypeName> {
	typeName: T,
}

export interface AlgoliaRecordBase<T extends AlgoliaRecordTypeName>
	extends ObjectID, AlgoliaRecordTypeNameBase<T> {}

export interface AlgoliaRecordImage {
	image: string,
}

export interface AlgoliaRecordPlays {
	plays: number,
}

export interface AlgoliaRecordUser
	extends
	AlgoliaRecordImage,
	Pick<UserBase, "name" | "emailAddress">,
	AlgoliaRecordBase<"User"> {
	followers: number,
}

export interface AlgoliaRecordSong
	extends
	AlgoliaRecordImage,
	AlgoliaRecordPlays,
	AlgoliaRecordBase<"Song">,
	Pick<SongBase, "mix" | "title"> {
	album: AlbumIDTitleBase,
	genres: GenreIDNameBase[],
	artists: ArtistIDNameBase[],
	remixers: ArtistIDNameBase[],
	featuring: ArtistIDNameBase[],
}

export interface AlgoliaRecordGenre
	extends
	AlgoliaRecordPlays,
	Pick<GenreBase, "name">,
	AlgoliaRecordBase<"Genre"> {}

export interface AlgoliaRecordAlbum
	extends
	AlgoliaRecordImage,
	AlgoliaRecordPlays,
	AlgoliaRecordBase<"Album">,
	Omit<AlbumBase, "albumID"> {
	artists: ArtistIDNameBase[],
}

export interface AlgoliaRecordArtist
	extends
	AlgoliaRecordImage,
	AlgoliaRecordPlays,
	AlgoliaRecordBase<"Artist">,
	Omit<ArtistBase, "artistID"> {
	city?: string,
	country?: string,
}

export interface AlgoliaRecordPlaylist
	extends
	AlgoliaRecordPlays,
	AlgoliaRecordBase<"Playlist">,
	Omit<PlaylistBase, "playlistID"> {
	user: UserIDNameBase,
}

export type AlgoliaRecord =
	AlgoliaRecordUser |
	AlgoliaRecordSong |
	AlgoliaRecordGenre |
	AlgoliaRecordAlbum |
	AlgoliaRecordArtist |
	AlgoliaRecordPlaylist