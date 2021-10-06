import uniqueID from "lodash/uniqueId"

import UserPage from "./user"
import SongsPage from "./song"
import GenrePage from "./genre"
import AlbumPage from "./album"
import QueuesPage from "./queues"
import SearchPage from "./search"
import ArtistPage from "./artist"
import BrowsePage from "./browse"
import LibraryPage from "./library"
import SettingsPage from "./settings"
import PlaylistPage from "./playlist"
import CustomShufflePage from "./custom-shuffle"
import AddSongToPlaylistPage from "./add-song-to-playlist"
import AddAlbumToPlaylistPage from "./add-album-to-playlist"
import TopOneHundredSongsPage from "./top-one-hundred-songs"

import { Route } from "../types"

const routes: Route[] = [{
	path: "/",
	exact: true,
	routeID: uniqueID(),
	component: BrowsePage,
},{
	routeID: uniqueID(),
	component: UserPage,
	path: "/user/:userID",
},{
	routeID: uniqueID(),
	component: SongsPage,
	path: "/song/:songID",
},{
	routeID: uniqueID(),
	path: "/search",
	component: SearchPage,
},{
	routeID: uniqueID(),
	path: "/queues",
	component: QueuesPage,
},{
	routeID: uniqueID(),
	path: "/library",
	component: LibraryPage,
},{
	routeID: uniqueID(),
	component: AlbumPage,
	path: "/album/:albumID",
},{
	routeID: uniqueID(),
	component: GenrePage,
	path: "/genre/:genreID",
},{
	routeID: uniqueID(),
	path: "/settings",
	component: SettingsPage,
},{
	routeID: uniqueID(),
	component: ArtistPage,
	path: "/artist/:artistID",
},{
	routeID: uniqueID(),
	path: "/custom-shuffle",
	component: CustomShufflePage,
},{
	routeID: uniqueID(),
	component: PlaylistPage,
	path: "/playlist/:playlistID",
},{
	routeID: uniqueID(),
	path: "/top-one-hundred-songs",
	component: TopOneHundredSongsPage,
},{
	routeID: uniqueID(),
	component: AddSongToPlaylistPage,
	path: "/add-song-to-playlist/:songID",
},{
	routeID: uniqueID(),
	component: AddAlbumToPlaylistPage,
	path: "/add-album-to-playlist/:albumID",
}]

export default routes