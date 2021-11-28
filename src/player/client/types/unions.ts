import {
	User,
	Song,
	Genre,
	Album,
	Artist,
	Playlist,
} from "./objects"

export type InLibraryObjects =
	Song | Artist | Playlist

export type Search =
	User | Song | Genre | Album | Artist | Playlist