import { User, Song, Genre, Album, Artist, Search, Playlist } from "../../types"

export const isUser =
	(object: Search): object is User =>
		object.__typename === "User"

export const isSong =
	(object: Search): object is Song =>
		object.__typename === "Song"

export const isGenre =
	(object: Search): object is Genre =>
		object.__typename === "Genre"

export const isAlbum =
	(object: Search): object is Album =>
		object.__typename === "Album"

export const isArtist =
	(object: Search): object is Artist =>
		object.__typename === "Artist"

export const isPlaylist =
	(object: Search): object is Playlist =>
		object.__typename === "Playlist"