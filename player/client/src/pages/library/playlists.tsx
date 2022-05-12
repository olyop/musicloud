import { isNull } from "lodash-es"
import { createElement, FC, useContext } from "react"
import { Head } from "@oly_op/react-head"

import {
	LibraryPlaylistsOrderBy,
	LibraryPlaylistsPaginated,
	LibraryPlaylistsOrderByField,
} from "../../types"

import LibraryEmpty from "./empty"
import Feed from "../../components/feed"
import { useStateOrderBy } from "../../redux"
import Playlists from "../../components/playlists"
import ScrollElementContext from "../scroll-element-context"
import GET_LIBRARY_PLAYLISTS from "./get-library-playlists.gql"

const LibraryPlaylists: FC = () => {
	const scrollElement = useContext(ScrollElementContext)
	const orderBy = useStateOrderBy<LibraryPlaylistsOrderByField>("libraryPlaylists")
	return (
		<Head pageTitle="Library Playlists">
			<Feed<GetLibraryPlaylistsData, GetLibraryPlaylistsVars>
				variables={{ orderBy }}
				query={GET_LIBRARY_PLAYLISTS}
				scrollElement={scrollElement}
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
		</Head>
	)
}

interface GetLibraryPlaylistsVars {
	orderBy: LibraryPlaylistsOrderBy,
}

interface GetLibraryPlaylistsData {
	getLibrary: LibraryPlaylistsPaginated,
}

export default LibraryPlaylists