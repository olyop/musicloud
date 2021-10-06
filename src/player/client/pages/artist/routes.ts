import uniqueID from "lodash/uniqueId"

import { Route } from "../../types"
import ArtistPageHome from "./home"
import ArtistPageSongs from "./songs"
import ArtistPageAlbums from "./albums"

const routes: Route[] = [{
	path: "",
	exact: true,
	icon: "home",
	underline: false,
	routeID: uniqueID(),
	component: ArtistPageHome,
},{
	name: "Songs",
	path: "/songs",
	icon: "audiotrack",
	routeID: uniqueID(),
	component: ArtistPageSongs,
},{
	icon: "album",
	name: "Albums",
	path: "/albums",
	routeID: uniqueID(),
	component: ArtistPageAlbums,
}]

export default routes