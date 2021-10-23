import {
	SettingsTheme,
	OrderByDirection,
	SettingsListStyle,
	SongsOrderByField,
	GenresOrderByField,
	AlbumsOrderByField,
	ArtistsOrderByField,
	PlaylistsOrderByField,
	LibrarySongsOrderByField,
	LibraryArtistsOrderByField,
	LibraryPlaylistsOrderByField,
} from "./enums"

import { UserQueues } from "./objects"

export interface OrderBy<F = string> {
	field: F,
	direction: OrderByDirection,
}

export type SongsOrderBy = OrderBy<SongsOrderByField>
export type GenresOrderBy = OrderBy<GenresOrderByField>
export type AlbumsOrderBy = OrderBy<AlbumsOrderByField>
export type ArtistsOrderBy = OrderBy<ArtistsOrderByField>
export type PlaylistsOrderBy = OrderBy<PlaylistsOrderByField>
export type LibrarySongsOrderBy = OrderBy<LibrarySongsOrderByField>
export type LibraryArtistsOrderBy = OrderBy<LibraryArtistsOrderByField>
export type LibraryPlaylistsOrderBy = OrderBy<LibraryPlaylistsOrderByField>

export type SettingsQueuesDisclosure = Record<keyof UserQueues, boolean>

export interface SettingsOrderBy {
	songs: SongsOrderBy,
	genres: GenresOrderBy,
	albums: AlbumsOrderBy,
	artists: ArtistsOrderBy,
	playlists: PlaylistsOrderBy,
	librarySongs: LibrarySongsOrderBy,
	libraryArtists: LibraryArtistsOrderBy,
	libraryPlaylists: LibraryPlaylistsOrderBy,
}

export interface Settings {
	volume: number,
	showGenres: boolean,
	theme: SettingsTheme,
	showReleased: boolean,
	showDuration: boolean,
	doTransitions: boolean,
	orderBy: SettingsOrderBy,
	listStyle: SettingsListStyle,
	queuesDisclosure: SettingsQueuesDisclosure,
}

export interface State {
	play: boolean,
	current: number,
	sidebar: boolean,
	loading: string[],
	isOnline: boolean,
	settings: Settings,
	isFullscreen: boolean,
}