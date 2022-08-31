import { createElement, FC } from "react"
import { useRoutes, RouteObject } from "react-router-dom"

import HomePage from "./pages"
import UserPage from "./pages/user"
import SongsPage from "./pages/song"
import GenrePage from "./pages/genre"
import AlbumPage from "./pages/album"
import QueuesPage from "./pages/queues"
import SearchPage from "./pages/search"
import ArtistPage from "./pages/artist"
import LibraryPage from "./pages/library"
import SettingsPage from "./pages/settings"
import PlaylistPage from "./pages/playlist"
import ManageAccount from "./pages/manage-account"
import TopOneHundredSongsPage from "./pages/top-one-hundred-songs"

const routes: RouteObject[] = [{
	path: "",
	element: <HomePage/>,
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
}]

const Routes: FC =
	() => useRoutes(routes)

export default Routes