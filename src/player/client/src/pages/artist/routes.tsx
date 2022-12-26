import uniqueID from "lodash-es/uniqueId";
import { createElement } from "react";

import { RouteObjectCustom } from "../../types";
import ArtistPageAlbums from "./albums";
import ArtistPageHome from "./home";
import ArtistPageSongs from "./songs";

const routes: RouteObjectCustom[] = [
	{
		path: "",
		index: true,
		icon: "home",
		routeID: uniqueID(),
		element: <ArtistPageHome />,
	},
	{
		name: "Songs",
		path: "songs",
		icon: "audiotrack",
		routeID: uniqueID(),
		element: <ArtistPageSongs />,
	},
	{
		icon: "album",
		name: "Albums",
		path: "albums",
		routeID: uniqueID(),
		element: <ArtistPageAlbums />,
	},
];

export default routes;
