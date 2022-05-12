import { isNull } from "lodash-es"
import { createElement, FC, useContext } from "react"
import { Head } from "@oly_op/react-head"

import {
	SettingsListStyle,
	LibraryArtistsOrderBy,
	LibraryArtistsPaginated,
	LibraryArtistsOrderByField,
} from "../../types"

import LibraryEmpty from "./empty"
import Feed from "../../components/feed"
import Artists from "../../components/artists"
import GET_LIBRARY_ARTISTS from "./get-library-artists.gql"
import ScrollElementContext from "../scroll-element-context"
import { useStateOrderBy, useStateListStyle } from "../../redux"

const LibraryArtists: FC = () => {
	const listStyle = useStateListStyle()
	const isList = listStyle === SettingsListStyle.LIST
	const scrollElement = useContext(ScrollElementContext)
	const orderBy = useStateOrderBy<LibraryArtistsOrderByField>("libraryArtists")
	return (
		<Head pageTitle="Library Artists">
			<Feed<GetLibraryArtistsData, LibraryArtistsVars>
				variables={{ orderBy }}
				query={GET_LIBRARY_ARTISTS}
				scrollElement={scrollElement}
				dataToObjectsLength={
					data => data.getLibrary.artistsPaginated?.length || 0
				}
				render={
					({ data }) => {
						if (data) {
							if (isNull(data.getLibrary.artistsPaginated)) {
								return (
									<LibraryEmpty
										name="artists"
									/>
								)
							} else {
								return (
									<Artists
										artists={data.getLibrary.artistsPaginated}
										className={isList ? "Content" : "PaddingLeft PaddingRight"}
										orderBy={{
											key: "libraryArtists",
											fields: Object.keys(LibraryArtistsOrderByField),
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

interface LibraryArtistsVars {
	orderBy: LibraryArtistsOrderBy,
}

interface GetLibraryArtistsData {
	getLibrary: LibraryArtistsPaginated,
}

export default LibraryArtists