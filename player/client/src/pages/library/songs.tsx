import { createElement, FC } from "react"

import {
	LibrarySongsOrderByField,
	LibrarySongs as LibrarySongsType,
} from "../../types"

import { useQuery } from "../../hooks"
import Songs from "../../components/songs"
import GET_LIBRARY_SONGS from "./get-library-songs.gql"

const LibrarySongs: FC = () => {
	const { data } = useQuery<Data>(GET_LIBRARY_SONGS)
	return data?.getLibrary.songs ? (
		<Songs
			hidePlays
			hideIndex
			hideTrackNumber
			className="Content"
			songs={data.getLibrary.songs}
			orderBy={{
				key: "librarySongs",
				fields: Object.keys(LibrarySongsOrderByField),
			}}
		/>
	) : null
}

interface Data {
	getLibrary: LibrarySongsType,
}

export default LibrarySongs