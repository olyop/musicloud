import {
	State,
	Settings,
	SettingsTheme,
	OrderByDirection,
	SettingsListStyle,
	SongsOrderByField,
	AlbumsOrderByField,
	GenresOrderByField,
	ArtistsOrderByField,
	SettingsTransitions,
	PlaylistsOrderByField,
	LibrarySongsOrderByField,
	LibraryArtistsOrderByField,
	LibraryPlaylistsOrderByField,
} from "../types"

export const initialSettings: Settings = {
	volume: 75,
	showGenres: false,
	showDuration: false,
	showReleased: false,
	gridChildWidth: 200,
	theme: SettingsTheme.SYSTEM,
	listStyle: SettingsListStyle.GRID,
	transitions: SettingsTransitions.SYSTEM,
	queuesDisclosure: {
		next: true,
		later: false,
		previous: false,
	},
	orderBy: {
		songs: {
			field: SongsOrderByField.TITLE,
			direction: OrderByDirection.ASC,
		},
		artists: {
			field: ArtistsOrderByField.NAME,
			direction: OrderByDirection.ASC,
		},
		genres: {
			field: GenresOrderByField.NAME,
			direction: OrderByDirection.ASC,
		},
		albums: {
			direction: OrderByDirection.DESC,
			field: AlbumsOrderByField.RELEASED,
		},
		playlists: {
			direction: OrderByDirection.ASC,
			field: PlaylistsOrderByField.TITLE,
		},
		librarySongs: {
			direction: OrderByDirection.DESC,
			field: LibrarySongsOrderByField.DATE_ADDED,
		},
		libraryArtists: {
			direction: OrderByDirection.DESC,
			field: LibraryArtistsOrderByField.DATE_ADDED,
		},
		libraryPlaylists: {
			direction: OrderByDirection.DESC,
			field: LibraryPlaylistsOrderByField.DATE_ADDED,
		},
	},
}

export const initialState: State = {
	play: false,
	loading: [],
	sidebar: true,
	isOnline: true,
	pageTitle: null,
	accessToken: null,
	settings: initialSettings,
}