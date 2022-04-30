import { isNull } from "lodash-es"
import { createElement, FC } from "react"
import { Metadata } from "@oly_op/react-metadata"

import LibraryEmpty from "./empty"
import Feed from "../../components/feed"
import Genres from "../../components/genres"
import { useStateOrderBy } from "../../redux"
import GET_LIBRARY_GENRES from "./get-library-genres.gql"
import { GenresOrderBy, GenresOrderByField, LibraryGenresPaginated } from "../../types"

const LibraryGenres: FC = () => {
	const orderBy = useStateOrderBy<GenresOrderByField>("genres")
	return (
		<Metadata title="Library Genres">
			<Feed<LibraryGenresData, LibraryGenresVars>
				variables={{ orderBy }}
				query={GET_LIBRARY_GENRES}
				dataToObjectsLength={
					data => data.getLibrary.genresPaginated?.length || 0
				}
				render={
					({ data }) => {
						if (data) {
							if (isNull(data.getLibrary.genresPaginated)) {
								return (
									<LibraryEmpty
										name="genres"
									/>
								)
							} else {
								return (
									<Genres
										orderBy
										className="Content"
										genres={data.getLibrary.genresPaginated}
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

interface LibraryGenresVars {
	orderBy: GenresOrderBy,
}

interface LibraryGenresData {
	getLibrary: LibraryGenresPaginated,
}

export default LibraryGenres