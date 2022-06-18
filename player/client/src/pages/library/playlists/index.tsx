import { Head } from "@oly_op/react-head"
import { createElement, FC } from "react"

import {
	OrderByOptions,
	PlaylistsOrderByField,
	Playlist as PlaylistType,
	SettingsOrderByPlaylists,
} from "../../../types"

import Feed from "../../../components/feed"
import Playlist from "../../../components/playlist"
import Playlists from "../../../components/playlists"
import GET_LIBRARY_PLAYLISTS_TOTAL from "./get-library-playlists-total.gql"
import GET_LIBRARY_PLAYLIST_AT_INDEX from "./get-library-playlist-at-index.gql"

import "./index.scss"

const orderBy: OrderByOptions<SettingsOrderByPlaylists> = {
	key: "libraryPlaylists",
	fields: Object.keys(PlaylistsOrderByField),
}

const LibraryPlaylists: FC = () => (
	<Head pageTitle="Library Songs">
		<Playlists orderBy={orderBy} className="Content">
			<Feed<GetPlaylistsTotalData, PlaylistType, GetPlaylistAtIndexData>
				settingsOrderBy="libraryPlaylists"
				itemQuery={GET_LIBRARY_PLAYLIST_AT_INDEX}
				itemsTotalQuery={GET_LIBRARY_PLAYLISTS_TOTAL}
				itemDataToValue={({ getLibrary }) => getLibrary.playlistAtIndex}
				itemsTotalDataToValue={({ getLibrary }) => getLibrary.playlistsTotal}
				renderItem={(ref, playlist) => (
					<Playlist
						ref={ref}
						playlist={playlist}
						className="LibraryPlaylist"
					/>
				)}
			/>
		</Playlists>
	</Head>
)

interface GetPlaylistsTotalData {
	getLibrary: {
		playlistsTotal: number | null,
	},
}

interface GetPlaylistAtIndexData {
	getLibrary: {
		playlistAtIndex: PlaylistType | null,
	},
}

export default LibraryPlaylists