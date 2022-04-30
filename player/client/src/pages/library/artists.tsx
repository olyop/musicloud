import { isNull } from "lodash-es"
import { createElement, FC } from "react"
import { Metadata } from "@oly_op/react-metadata"

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
import { useStateOrderBy, useStateListStyle } from "../../redux"

const LibraryArtists: FC = () => {
	const listStyle = useStateListStyle()
	const isList = listStyle === SettingsListStyle.LIST
	const orderBy = useStateOrderBy<LibraryArtistsOrderByField>("libraryArtists")
	return (
		<Metadata title="Library Artists">
			<Feed<GetLibraryArtistsData, LibraryArtistsVars>
				variables={{ orderBy }}
				query={GET_LIBRARY_ARTISTS}
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
		</Metadata>
	)
}

interface LibraryArtistsVars {
	orderBy: LibraryArtistsOrderBy,
}

interface GetLibraryArtistsData {
	getLibrary: LibraryArtistsPaginated,
}

export default LibraryArtists