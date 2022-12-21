import { FC, createElement } from "react";
import { RouteObject, useRoutes } from "react-router-dom";

import HomePage from "./pages";
import AlbumPage from "./pages/album";
import ArtistPage from "./pages/artist";
import GenrePage from "./pages/genre";
import LibraryPage from "./pages/library";
import PlaylistPage from "./pages/playlist";
import QueuesPage from "./pages/queues";
import SearchPage from "./pages/search";
import SettingsPage from "./pages/settings";
import SongsPage from "./pages/song";
import TopOneHundredSongsPage from "./pages/top-one-hundred-songs";
import UserPage from "./pages/user";

const routes: RouteObject[] = [
	{
		path: "",
		element: <HomePage />,
	},
	{
		element: <UserPage />,
		path: "user/:userID/*",
	},
	{
		element: <SongsPage />,
		path: "song/:songID",
	},
	{
		path: "search/*",
		element: <SearchPage />,
	},
	{
		path: "queues",
		element: <QueuesPage />,
	},
	{
		path: "library/*",
		element: <LibraryPage />,
	},
	{
		element: <AlbumPage />,
		path: "album/:albumID",
	},
	{
		element: <GenrePage />,
		path: "genre/:genreID",
	},
	{
		path: "settings",
		element: <SettingsPage />,
	},
	{
		element: <ArtistPage />,
		path: "artist/:artistID/*",
	},
	{
		element: <PlaylistPage />,
		path: "playlist/:playlistID",
	},
	{
		path: "top-one-hundred-songs",
		element: <TopOneHundredSongsPage />,
	},
];

const Routes: FC = () => useRoutes(routes);

export default Routes;
