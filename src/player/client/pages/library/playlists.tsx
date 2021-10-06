import isEmpty from "lodash/isEmpty"
import { createElement, FC } from "react"
import Metadata from "@oly_op/react-metadata"

import {
	User,
	LibraryPlaylistsOrderBy,
	LibraryPlaylistsOrderByField,
} from "../../types"

import LibraryEmpty from "./empty"
import Feed from "../../components/feed"
import { useStateOrderBy } from "../../redux"
import Playlists from "../../components/playlists"
import GET_LIBRARY_PLAYLISTS from "./get-library-playlists.gql"

const LibraryPlaylists: FC = () => {
	const orderBy = useStateOrderBy<LibraryPlaylistsOrderByField>("libraryPlaylists")
	return (
		<Metadata title="Library Playlists">
			<Feed<Data, Vars>
				variables={{ orderBy }}
				query={GET_LIBRARY_PLAYLISTS}
				dataToObjectsLength={({ user }) => user.libraryPlaylists.length}
				children={
					({ data }) => {
						if (data) {
							if (isEmpty(data.user.libraryPlaylists)) {
								return (
									<LibraryEmpty
										name="playlists"
									/>
								)
							} else {
								return (
									<Playlists
										className="Content"
										orderByKey="libraryPlaylists"
										playlists={data.user.libraryPlaylists}
										orderByFields={Object.keys(LibraryPlaylistsOrderByField)}
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

interface Data {
	user: User,
}

interface Vars {
	orderBy: LibraryPlaylistsOrderBy,
}

export default LibraryPlaylists