import isEmpty from "lodash/isEmpty"
import { createElement, FC } from "react"
import Metadata from "@oly_op/react-metadata"

import {
	User,
	SettingsListStyle,
	LibraryArtistsOrderBy,
	LibraryArtistsOrderByField,
} from "../../types"

import LibraryEmpty from "./empty"
import Feed from "../../components/feed"
import Artists from "../../components/artists"
import GET_LIBRARY_ARTISTS from "./get-library-artists.gql"
import { useStateOrderBy, useStateListStyle } from "../../redux"

const LibraryArtists: FC = () => {
	const orderBy = useStateOrderBy<LibraryArtistsOrderByField>("libraryArtists")
	const listStyle = useStateListStyle()
	const isList = listStyle === SettingsListStyle.LIST
	return (
		<Metadata title="Library Artists">
			<Feed<Data, Vars>
				variables={{ orderBy }}
				query={GET_LIBRARY_ARTISTS}
				dataToObjectsLength={({ user }) => user.libraryArtists.length}
				children={
					({ data }) => {
						if (data) {
							if (isEmpty(data.user.libraryArtists)) {
								return (
									<LibraryEmpty
										name="artists"
									/>
								)
							} else {
								return (
									<Artists
										orderByKey="libraryArtists"
										artists={data.user.libraryArtists}
										hideOrderBy={isEmpty(data.user.libraryArtists)}
										orderByFields={Object.keys(LibraryArtistsOrderByField)}
										className={isList ? "Content" : "PaddingBottom PaddingLeft PaddingRight"}
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
	orderBy: LibraryArtistsOrderBy,
}

export default LibraryArtists