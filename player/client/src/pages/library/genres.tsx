import { isNull } from "lodash-es"
import { createElement, FC, useContext } from "react"
import { Head } from "@oly_op/react-head"

import LibraryEmpty from "./empty"
import Feed from "../../components/feed"
import Genres from "../../components/genres"
import { useStateOrderBy } from "../../redux"
import GET_LIBRARY_GENRES from "./get-library-genres.gql"
import ScrollElementContext from "../scroll-element-context"
import { GenresOrderBy, GenresOrderByField, LibraryGenresPaginated } from "../../types"

const LibraryGenres: FC = () => {
	const scrollElement = useContext(ScrollElementContext)
	const orderBy = useStateOrderBy<GenresOrderByField>("genres")
	return (
		<Head pageTitle="Library Genres">
			<Feed<LibraryGenresData, LibraryGenresVars>
				variables={{ orderBy }}
				query={GET_LIBRARY_GENRES}
				scrollElement={scrollElement}
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
		</Head>
	)
}

interface LibraryGenresVars {
	orderBy: GenresOrderBy,
}

interface LibraryGenresData {
	getLibrary: LibraryGenresPaginated,
}

export default LibraryGenres