import { createBEM } from "@oly_op/bem"
import { createElement, VFC } from "react"
import { Route, Routes } from "react-router-dom"
import { uniqueId as uniqueID } from "lodash-es"

import { Route as RouteType } from "../types"

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
import AddAlbumToPlaylistPage from "./add-album-to-playlist"
import TopOneHundredSongsPage from "./top-one-hundred-songs"

import "./index.scss"

const routes: RouteType[] = [{
	path: "",
	routeID: uniqueID(),
	element: <BrowsePage/>,
},{
	routeID: uniqueID(),
	element: <UserPage/>,
	path: "user/:userID/*",
},{
	routeID: uniqueID(),
	element: <SongsPage/>,
	path: "song/:songID",
},{
	routeID: uniqueID(),
	path: "search/*",
	element: <SearchPage/>,
},{
	routeID: uniqueID(),
	path: "queues",
	element: <QueuesPage/>,
},{
	routeID: uniqueID(),
	path: "library/*",
	element: <LibraryPage/>,
},{
	routeID: uniqueID(),
	element: <AlbumPage/>,
	path: "album/:albumID",
},{
	routeID: uniqueID(),
	element: <GenrePage/>,
	path: "genre/:genreID",
},{
	routeID: uniqueID(),
	path: "settings",
	element: <SettingsPage/>,
},{
	routeID: uniqueID(),
	path: "manage-account",
	element: <ManageAccount/>,
},{
	routeID: uniqueID(),
	element: <ArtistPage/>,
	path: "artist/:artistID/*",
},{
	routeID: uniqueID(),
	element: <PlaylistPage/>,
	path: "playlist/:playlistID",
},{
	routeID: uniqueID(),
	path: "top-one-hundred-songs",
	element: <TopOneHundredSongsPage/>,
},{
	routeID: uniqueID(),
	element: <AddSongToPlaylistPage/>,
	path: "add-song-to-playlist/:songID",
},{
	routeID: uniqueID(),
	element: <AddAlbumToPlaylistPage/>,
	path: "add-album-to-playlist/:albumID",
}]

const bem =
	createBEM("Pages")

const Pages: VFC = () => (
	<main className={bem("")}>
		<Routes>
			{routes.map(
				({ routeID, path, element }) => (
					<Route
						path={path}
						key={routeID}
						element={element}
					/>
				),
			)}
		</Routes>
	</main>
)

export default Pages