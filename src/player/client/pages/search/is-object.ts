import {
	AlgoliaRecord,
	AlgoliaRecordUser,
	AlgoliaRecordSong,
	AlgoliaRecordGenre,
	AlgoliaRecordAlbum,
	AlgoliaRecordArtist,
	AlgoliaRecordPlaylist,
} from "@oly_op/music-app-common/types"

export const isUser =
	(hit: AlgoliaRecord): hit is AlgoliaRecordUser =>
		hit.typeName === "User"

export const isSong =
	(hit: AlgoliaRecord): hit is AlgoliaRecordSong =>
		hit.typeName === "Song"

export const isGenre =
	(hit: AlgoliaRecord): hit is AlgoliaRecordGenre =>
		hit.typeName === "Genre"

export const isAlbum =
	(hit: AlgoliaRecord): hit is AlgoliaRecordAlbum =>
		hit.typeName === "Album"

export const isArtist =
	(hit: AlgoliaRecord): hit is AlgoliaRecordArtist =>
		hit.typeName === "Artist"

export const isPlaylist =
	(hit: AlgoliaRecord): hit is AlgoliaRecordPlaylist =>
		hit.typeName === "Playlist"