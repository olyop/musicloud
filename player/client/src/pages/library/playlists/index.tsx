import { Head } from "@oly_op/react-head"
import { createElement, FC } from "react"

import Feed from "../../../components/feeed"
import Playlist from "../../../components/playlist"
import Playlists from "../../../components/playlists"
import GET_LIBRARY_PLAYLISTS_TOTAL from "./get-library-songs-total.gql"
import GET_LIBRARY_SONG_AT_INDEX from "./get-library-song-at-index.gql"
import { Playlist as PlaylistType, PlaylistsOrderByField, OrderByOptions, SettingsOrderByPlaylists } from "../../../types"

import "./index.scss"

const orderBy: OrderByOptions<SettingsOrderByPlaylists> = {
	key: "libraryPlaylists",
	fields: Object.keys(PlaylistsOrderByField),
}

const LibraryPlaylists: FC = () => (
	<Head pageTitle="Library Songs">
		<Playlists orderBy={orderBy} className="Content">
			<Feed<GetPlaylistsTotalData, PlaylistType, GetPlaylistAtIndexData, PlaylistsOrderByField>
				settingsOrderBy="librarySongs"
				itemQuery={GET_LIBRARY_SONG_AT_INDEX}
				itemsTotalQuery={GET_LIBRARY_PLAYLISTS_TOTAL}
				itemDataToValue={({ getLibrary }) => getLibrary.songAtIndex}
				itemsTotalDataToValue={({ getLibrary }) => getLibrary.songsTotal}
				renderItem={(
					(ref, playlist) => (
						<Playlist
							hidePlays
							ref={ref}
							playlist={playlist}
							className="LibrarySong PaddingHalf ItemBorder"
						/>
					)
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
		playlistsAtIndex: PlaylistType | null,
	},
}

export default LibraryPlaylists