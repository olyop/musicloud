import { createElement } from "react"
import uniqueID from "lodash-es/uniqueId"

import { Route } from "../../types"
import ArtistPageHome from "./home"
import ArtistPageSongs from "./songs"
import ArtistPageAlbums from "./albums"

const routes: Route[] = [{
	path: "",
	end: true,
	icon: "home",
	routeID: uniqueID(),
	element: <ArtistPageHome/>,
},{
	name: "Songs",
	path: "songs",
	icon: "audiotrack",
	routeID: uniqueID(),
	element: <ArtistPageSongs/>,
},{
	icon: "album",
	name: "Albums",
	path: "albums",
	routeID: uniqueID(),
	element: <ArtistPageAlbums/>,
}]

export default routes