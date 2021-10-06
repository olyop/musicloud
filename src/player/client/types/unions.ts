import {
	User,
	Song,
	Genre,
	Album,
	Artist,
	Playlist,
	UserQueues,
} from "./objects"

export type QueueKeys =
	keyof UserQueues

export type InLibraryObjects =
	Song | Artist | Playlist

export type Search =
	User | Song | Genre | Album | Artist | Playlist