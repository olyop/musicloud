import isEmpty from "lodash/isEmpty"
import { createElement, FC } from "react"
import Metadata from "@oly_op/react-metadata"

import {
	User,
	AlbumsOrderBy,
	SettingsListStyle,
	AlbumsOrderByField,
} from "../../types"

import LibraryEmpty from "./empty"
import Feed from "../../components/feed"
import Albums from "../../components/albums"
import GET_LIBRARY_ALBUMS from "./get-library-albums.gql"
import { useStateOrderBy, useStateListStyle } from "../../redux"

const LibraryAlbums: FC = () => {
	const listStyle = useStateListStyle()
	const orderBy = useStateOrderBy<AlbumsOrderByField>("albums")
	const isList = listStyle === SettingsListStyle.LIST
	return (
		<Metadata title="Library Artists">
			<Feed<Data, Vars>
				query={GET_LIBRARY_ALBUMS}
				variables={{ orderBy }}
				dataToObjectsLength={({ user }) => user.libraryAlbums.length}
				children={
					({ data }) => {
						if (data) {
							if (isEmpty(data.user.libraryAlbums)) {
								return (
									<LibraryEmpty
										name="albums"
									/>
								)
							} else {
								return (
									<Albums
										albums={data.user.libraryAlbums}
										hideOrderBy={isEmpty(data.user.libraryAlbums)}
										orderByFields={Object.keys(AlbumsOrderByField)}
										className={isList ? "Content" : "PaddingLeft PaddingRight"}
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
	orderBy: AlbumsOrderBy,
}

export default LibraryAlbums