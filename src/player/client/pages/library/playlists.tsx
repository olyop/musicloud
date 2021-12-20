import isNull from "lodash/isNull"
import { createElement, VFC } from "react"
import { Metadata } from "@oly_op/react-metadata"

import {
	LibraryPlaylistsOrderBy,
	LibraryPlaylistsPaginated,
	LibraryPlaylistsOrderByField,
} from "../../types"

import LibraryEmpty from "./empty"
import Feed from "../../components/feed"
import { useStateOrderBy } from "../../redux"
import Playlists from "../../components/playlists"
import GET_LIBRARY_PLAYLISTS from "./get-library-playlists.gql"

const LibraryPlaylists: VFC = () => {
	const orderBy = useStateOrderBy<LibraryPlaylistsOrderByField>("libraryPlaylists")
	return (
		<Metadata title="Library Playlists">
			<Feed<GetLibraryPlaylistsData, GetLibraryPlaylistsVars>
				variables={{ orderBy }}
				query={GET_LIBRARY_PLAYLISTS}
				dataToObjectsLength={
					data => data.getLibrary.playlistsPaginated?.length || 0
				}
				render={
					({ data }) => {
						if (data) {
							if (isNull(data.getLibrary.playlistsPaginated)) {
								return (
									<LibraryEmpty
										name="playlists"
									/>
								)
							} else {
								return (
									<Playlists
										className="Content"
										playlists={data.getLibrary.playlistsPaginated}
										orderBy={{
											key: "libraryPlaylists",
											fields: Object.keys(LibraryPlaylistsOrderByField),
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

interface GetLibraryPlaylistsVars {
	orderBy: LibraryPlaylistsOrderBy,
}

interface GetLibraryPlaylistsData {
	getLibrary: LibraryPlaylistsPaginated,
}

export default LibraryPlaylists