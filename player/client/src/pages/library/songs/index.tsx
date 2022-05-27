import { Head } from "@oly_op/react-head"
import { createElement, FC } from "react"

import Song from "../../../components/song"
import Feed from "../../../components/feed"
import Songs from "../../../components/songs"
import GET_LIBRARY_SONGS_TOTAL from "./get-library-songs-total.gql"
import GET_LIBRARY_SONG_AT_INDEX from "./get-library-song-at-index.gql"
import { Song as SongType, LibrarySongsOrderByField, OrderByOptions, SettingsOrderBySongs } from "../../../types"

import "./index.scss"

const orderBy: OrderByOptions<SettingsOrderBySongs> = {
	key: "librarySongs",
	fields: Object.keys(LibrarySongsOrderByField),
}

const LibrarySongs: FC = () => (
	<Head pageTitle="Library Songs">
		<Songs
			orderBy={orderBy}
			className="Content Elevated"
			children={(
				<Feed<GetSongsTotalData, SongType, GetSongAtIndexData, LibrarySongsOrderByField>
					settingsOrderBy="librarySongs"
					itemQuery={GET_LIBRARY_SONG_AT_INDEX}
					itemsTotalQuery={GET_LIBRARY_SONGS_TOTAL}
					itemDataToValue={({ getLibrary }) => getLibrary.songAtIndex}
					itemsTotalDataToValue={({ getLibrary }) => getLibrary.songsTotal}
					renderItem={(
						(ref, song) => (
							<Song
								hidePlays
								ref={ref}
								song={song}
								className="LibrarySong PaddingHalf ItemBorder"
							/>
						)
					)}
				/>
			)}
		/>
	</Head>
)

interface GetSongsTotalData {
	getLibrary: {
		songsTotal: number | null,
	},
}

interface GetSongAtIndexData {
	getLibrary: {
		songAtIndex: SongType | null,
	},
}

export default LibrarySongs