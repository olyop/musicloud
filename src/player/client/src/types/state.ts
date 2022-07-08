/* eslint-disable @typescript-eslint/indent */
import {
	SettingsTheme,
	OrderByDirection,
	SettingsListStyle,
	SongsOrderByField,
	GenresOrderByField,
	AlbumsOrderByField,
	ArtistsOrderByField,
	SettingsTransitions,
	PlaylistsOrderByField,
	LibrarySongsOrderByField,
	LibraryArtistsOrderByField,
	LibraryPlaylistsOrderByField,
} from "./enums"

import { QueuePreviousNextLater } from "./objects"

export interface OrderBy<F = string> {
	field: F,
	direction: OrderByDirection,
}

export type SongsOrderBy =
	OrderBy<SongsOrderByField>
export type GenresOrderBy =
	OrderBy<GenresOrderByField>
export type AlbumsOrderBy =
	OrderBy<AlbumsOrderByField>
export type ArtistsOrderBy =
	OrderBy<ArtistsOrderByField>
export type PlaylistsOrderBy =
	OrderBy<PlaylistsOrderByField>
export type LibrarySongsOrderBy =
	OrderBy<LibrarySongsOrderByField>
export type LibraryArtistsOrderBy =
	OrderBy<LibraryArtistsOrderByField>
export type LibraryPlaylistsOrderBy =
	OrderBy<LibraryPlaylistsOrderByField>

export type SettingsQueuesDisclosureKeys =
	keyof QueuePreviousNextLater
export type SettingsQueuesDisclosure =
	Record<SettingsQueuesDisclosureKeys, boolean>

export interface SettingsOrderBySongs {
	songs: SongsOrderBy,
	librarySongs: LibrarySongsOrderBy,
}

export interface SettingsOrderByGenres {
	genres: GenresOrderBy,
}

export interface SettingsOrderByAlbums {
	albums: AlbumsOrderBy,
}

export interface SettingsOrderByArtists {
	artists: ArtistsOrderBy,
	libraryArtists: LibraryArtistsOrderBy,
}

export interface SettingsOrderByPlaylists {
	playlists: PlaylistsOrderBy,
	libraryPlaylists: LibraryPlaylistsOrderBy,
}

export interface SettingsOrderBy
	extends
		SettingsOrderBySongs,
		SettingsOrderByGenres,
		SettingsOrderByAlbums,
		SettingsOrderByArtists,
		SettingsOrderByPlaylists {}

export interface Settings {
	volume: number,
	showGenres: boolean,
	theme: SettingsTheme,
	showReleased: boolean,
	showDuration: boolean,
	gridChildWidth: number,
	orderBy: SettingsOrderBy,
	listStyle: SettingsListStyle,
	transitions: SettingsTransitions,
	queuesDisclosure: SettingsQueuesDisclosure,
}

export type StatePageTitle =
	string | null

export interface State {
	play: boolean,
	sidebar: boolean,
	loading: string[],
	isOnline: boolean,
	settings: Settings,
	pageTitle: StatePageTitle,
	accessToken: string | null,
}