import uniqueID from "lodash/uniqueId"

import { Route } from "../../types"

import LibraryHome from "./home"
import LibrarySongs from "./songs"
import LibraryGenres from "./genres"
import LibraryAlbums from "./albums"
import LibraryArtists from "./artists"
import LibrarySettings from "./settings"
import LibraryPlaylists from "./playlists"

const routes: Route[] = [{
	path: "",
	exact: true,
	icon: "home",
	underline: false,
	routeID: uniqueID(),
	component: LibraryHome,
},{
	name: "Songs",
	path: "/songs",
	icon: "audiotrack",
	routeID: uniqueID(),
	component: LibrarySongs,
},{
	icon: "person",
	name: "Artists",
	path: "/artists",
	routeID: uniqueID(),
	component: LibraryArtists,
},{
	ignore: true,
	name: "Settings",
	path: "/settings",
	routeID: uniqueID(),
	component: LibrarySettings,
},{
	name: "Playlists",
	path: "/playlists",
	icon: "queue_music",
	routeID: uniqueID(),
	component: LibraryPlaylists,
},{
	icon: "list",
	name: "Genres",
	path: "/genres",
	routeID: uniqueID(),
	component: LibraryGenres,
},{
	icon: "album",
	name: "Albums",
	path: "/albums",
	routeID: uniqueID(),
	component: LibraryAlbums,
}]

export default routes