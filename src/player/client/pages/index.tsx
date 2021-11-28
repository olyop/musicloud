import uniqueId from "lodash/uniqueId"
import { createBEM } from "@oly_op/bem"
import { createElement, VFC } from "react"
import { Route, Routes } from "react-router-dom"

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
import CustomShufflePage from "./custom-shuffle"
import AddSongToPlaylistPage from "./add-song-to-playlist"
import AddAlbumToPlaylistPage from "./add-album-to-playlist"
import TopOneHundredSongsPage from "./top-one-hundred-songs"

import "./index.scss"

const routes: RouteType[] = [{
	path: "",
	routeID: uniqueId(),
	element: <BrowsePage/>,
},{
	routeID: uniqueId(),
	element: <UserPage/>,
	path: "user/:userID",
},{
	routeID: uniqueId(),
	element: <SongsPage/>,
	path: "song/:songID",
},{
	routeID: uniqueId(),
	path: "search/*",
	element: <SearchPage/>,
},{
	routeID: uniqueId(),
	path: "queues",
	element: <QueuesPage/>,
},{
	routeID: uniqueId(),
	path: "library/*",
	element: <LibraryPage/>,
},{
	routeID: uniqueId(),
	element: <AlbumPage/>,
	path: "album/:albumID",
},{
	routeID: uniqueId(),
	element: <GenrePage/>,
	path: "genre/:genreID",
},{
	routeID: uniqueId(),
	path: "settings",
	element: <SettingsPage/>,
},{
	routeID: uniqueId(),
	element: <ArtistPage/>,
	path: "artist/:artistID/*",
},{
	routeID: uniqueId(),
	path: "custom-shuffle",
	element: <CustomShufflePage/>,
},{
	routeID: uniqueId(),
	element: <PlaylistPage/>,
	path: "playlist/:playlistID",
},{
	routeID: uniqueId(),
	path: "top-one-hundred-songs",
	element: <TopOneHundredSongsPage/>,
},{
	routeID: uniqueId(),
	element: <AddSongToPlaylistPage/>,
	path: "add-song-to-playlist/:songID",
},{
	routeID: uniqueId(),
	element: <AddAlbumToPlaylistPage/>,
	path: "add-album-to-playlist/:albumID",
}]

const Pages: VFC = () => (
	<main className={createBEM("Pages")("")}>
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