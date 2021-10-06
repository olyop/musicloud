import isEmpty from "lodash/isEmpty"
import { createElement, FC } from "react"
import Metadata from "@oly_op/react-metadata"

import LibraryEmpty from "./empty"
import Feed from "../../components/feed"
import Genres from "../../components/genres"
import { useStateOrderBy } from "../../redux"
import GET_LIBRARY_GENRES from "./get-library-genres.gql"
import { User, GenresOrderBy, GenresOrderByField } from "../../types"

const LibraryGenres: FC = () => {
	const orderBy = useStateOrderBy<GenresOrderByField>("genres")
	return (
		<Metadata title="Library Genres">
			<Feed<Data, Vars>
				variables={{ orderBy }}
				query={GET_LIBRARY_GENRES}
				dataToObjectsLength={({ user }) => user.libraryGenres.length}
				children={
					({ data }) => {
						if (data) {
							if (isEmpty(data.user.libraryGenres)) {
								return (
									<LibraryEmpty
										name="genres"
									/>
								)
							} else {
								return (
									<Genres
										className="Content"
										genres={data.user.libraryGenres}
										hideOrderBy={isEmpty(data.user.libraryGenres)}
										orderByFields={Object.keys(GenresOrderByField)}
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
	orderBy: GenresOrderBy,
}

export default LibraryGenres