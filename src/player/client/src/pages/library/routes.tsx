import uniqueID from "lodash-es/uniqueId";
import { createElement } from "react";

import { RouteObjectCustom } from "../../types";
import LibraryAlbums from "./albums";
import LibraryArtists from "./artists";
import LibraryGenres from "./genres";
import LibraryHome from "./home";
import LibraryPlaylists from "./playlists";
import LibrarySettings from "./settings";
import LibrarySongs from "./songs";

const routes: RouteObjectCustom[] = [
	{
		path: "",
		end: true,
		icon: "home",
		routeID: uniqueID(),
		element: <LibraryHome />,
	},
	{
		name: "Songs",
		path: "songs",
		icon: "audiotrack",
		routeID: uniqueID(),
		element: <LibrarySongs />,
	},
	{
		icon: "person",
		name: "Artists",
		path: "artists",
		routeID: uniqueID(),
		element: <LibraryArtists />,
	},
	{
		ignore: true,
		name: "Settings",
		path: "settings",
		routeID: uniqueID(),
		element: <LibrarySettings />,
	},
	{
		name: "Playlists",
		path: "playlists",
		icon: "queue_music",
		routeID: uniqueID(),
		element: <LibraryPlaylists />,
	},
	{
		icon: "list",
		name: "Genres",
		path: "genres",
		routeID: uniqueID(),
		element: <LibraryGenres />,
	},
	{
		icon: "album",
		name: "Albums",
		path: "albums",
		routeID: uniqueID(),
		element: <LibraryAlbums />,
	},
];

export default routes;
