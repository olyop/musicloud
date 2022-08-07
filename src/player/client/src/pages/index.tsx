import { createElement, FC } from "react"
import { useRoutes, RouteObject } from "react-router-dom"

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
import ManageAccount from "./manage-account"
import AddSongToPlaylistPage from "./add-song-to-playlist"
// import AddAlbumToPlaylistPage from "./add-album-to-playlist"
import TopOneHundredSongsPage from "./top-one-hundred-songs"

const routes: RouteObject[] = [{
	path: "",
	element: <BrowsePage/>,
},{
	element: <UserPage/>,
	path: "user/:userID/*",
},{
	element: <SongsPage/>,
	path: "song/:songID",
},{
	path: "search/*",
	element: <SearchPage/>,
},{
	path: "queues",
	element: <QueuesPage/>,
},{
	path: "library/*",
	element: <LibraryPage/>,
},{
	element: <AlbumPage/>,
	path: "album/:albumID",
},{
	element: <GenrePage/>,
	path: "genre/:genreID",
},{
	path: "settings",
	element: <SettingsPage/>,
},{
	path: "manage-account",
	element: <ManageAccount/>,
},{
	element: <ArtistPage/>,
	path: "artist/:artistID/*",
},{
	element: <PlaylistPage/>,
	path: "playlist/:playlistID",
},{
	path: "top-one-hundred-songs",
	element: <TopOneHundredSongsPage/>,
},{
	element: <AddSongToPlaylistPage/>,
	path: "add-song-to-playlist/:songID",
},{
	// element: <AddAlbumToPlaylistPage/>,
	path: "add-album-to-playlist/:albumID",
}]

const Pages: FC =
	() => useRoutes(routes)

export default Pages