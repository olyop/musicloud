import { createElement } from "react"
import { uniqueId as uniqueID } from "lodash-es"

import { Route } from "../../types"

import LibraryHome from "./home"
import LibrarySongs from "./songs"
import LibraryGenres from "./genres"
import LibraryAlbums from "./albums"
// import LibraryArtists from "./artists"
import LibrarySettings from "./settings"
import LibraryPlaylists from "./playlists"

const routes: Route[] = [{
	path: "",
	icon: "home",
	underline: false,
	routeID: uniqueID(),
	element: <LibraryHome/>,
},{
	name: "Songs",
	path: "songs",
	icon: "audiotrack",
	routeID: uniqueID(),
	element: <LibrarySongs/>,
},{
	icon: "person",
	name: "Artists",
	path: "artists",
	routeID: uniqueID(),
	// element: <LibraryArtists/>,
},{
	ignore: true,
	name: "Settings",
	path: "settings",
	routeID: uniqueID(),
	element: <LibrarySettings/>,
},{
	name: "Playlists",
	path: "playlists",
	icon: "queue_music",
	routeID: uniqueID(),
	element: <LibraryPlaylists/>,
},{
	icon: "list",
	name: "Genres",
	path: "genres",
	routeID: uniqueID(),
	element: <LibraryGenres/>,
},{
	icon: "album",
	name: "Albums",
	path: "albums",
	routeID: uniqueID(),
	element: <LibraryAlbums/>,
}]

export default routes