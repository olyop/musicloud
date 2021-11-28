import isNull from "lodash/isNull"
import { createElement, VFC } from "react"
import Metadata from "@oly_op/react-metadata"

import {
	LibrarySongsOrderBy,
	LibrarySongsPaginated,
	LibrarySongsOrderByField,
} from "../../types"

import LibraryEmpty from "./empty"
import Feed from "../../components/feed"
import Songs from "../../components/songs"
import { useStateOrderBy } from "../../redux"
import GET_LIBRARY_SONGS from "./get-library-songs.gql"

const LibrarySongs: VFC = () => {
	const orderBy = useStateOrderBy<LibrarySongsOrderByField>("librarySongs")
	return (
		<Metadata title="Library Songs">
			<Feed<GetLibrarySongsData, GetLibrarySongsVars>
				variables={{ orderBy }}
				query={GET_LIBRARY_SONGS}
				dataToObjectsLength={
					data => data.getLibrary.songsPaginated?.length || 0
				}
				render={
					({ data }) => {
						if (data) {
							if (isNull(data.getLibrary.songsPaginated)) {
								return (
									<LibraryEmpty
										name="songs"
									/>
								)
							} else {
								return (
									<Songs
										hidePlays
										hideIndex
										hideTrackNumber
										className="Content"
										songs={data.getLibrary.songsPaginated}
										orderBy={{
											key: "librarySongs",
											fields: Object.keys(LibrarySongsOrderByField),
										}}
									/>
								)
							}
						} else {
							return null
						}
					}
				}
			/>
		</Metadata>
	)
}

interface GetLibrarySongsVars {
	orderBy: LibrarySongsOrderBy,
}

interface GetLibrarySongsData {
	getLibrary: LibrarySongsPaginated,
}

export default LibrarySongs