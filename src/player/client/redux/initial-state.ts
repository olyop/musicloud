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
	PlaylistsOrderByField,
	LibrarySongsOrderByField,
	LibraryArtistsOrderByField,
	LibraryPlaylistsOrderByField,
} from "../types"

const settings: Settings = {
	volume: 0,
	showGenres: false,
	showDuration: false,
	showReleased: false,
	doTransitions: true,
	theme: SettingsTheme.SYSTEM,
	listStyle: SettingsListStyle.GRID,
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
	settings,
	current: 0,
	play: false,
	loading: [],
	sidebar: false,
	isOnline: true,
	accessToken: null,
	isFullscreen: false,
}