import isEmpty from "lodash/isEmpty"
import { createElement, FC } from "react"
import Metadata from "@oly_op/react-metadata"

import {
	User,
	LibrarySongsOrderBy,
	LibrarySongsOrderByField,
} from "../../types"

import LibraryEmpty from "./empty"
import Feed from "../../components/feed"
import Songs from "../../components/songs"
import { useStateOrderBy } from "../../redux"
import GET_LIBRARY_SONGS from "./get-library-songs.gql"

const LibrarySongs: FC = () => {
	const orderBy = useStateOrderBy<LibrarySongsOrderByField>("librarySongs")
	return (
		<Metadata title="Library Songs">
			<Feed<Data, Vars>
				variables={{ orderBy }}
				query={GET_LIBRARY_SONGS}
				dataToObjectsLength={({ user }) => user.librarySongs.length}
				children={
					({ error, data }) => {
						if (data) {
							if (isEmpty(data.user.librarySongs)) {
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
										orderByKey="librarySongs"
										songs={data.user.librarySongs}
										hideOrderBy={isEmpty(data?.user.librarySongs)}
										orderByFields={Object.keys(LibrarySongsOrderByField)}
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
	orderBy: LibrarySongsOrderBy,
}

export default LibrarySongs