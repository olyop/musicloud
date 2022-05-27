import { isNull } from "lodash-es"
import { Head } from "@oly_op/react-head"
import { createElement, FC } from "react"

import {
	AlbumsOrderBy,
	SettingsListStyle,
	AlbumsOrderByField,
	LibraryAlbumsPaginated,
} from "../../types"

import LibraryEmpty from "./empty"
import Feed from "../../components/feed"
import Albums from "../../components/albums"
import GET_LIBRARY_ALBUMS from "./get-library-albums.gql"
import { useStateOrderBy, useStateListStyle } from "../../redux"

const LibraryAlbums: FC = () => {
	const listStyle = useStateListStyle()
	const isList = listStyle === SettingsListStyle.LIST
	const orderBy = useStateOrderBy<AlbumsOrderByField>("albums")
	return (
		<Head pageTitle="Library Albums">
			<Feed<GetLibraryAlbumsData, GetLibraryAlbumsVars>
				variables={{ orderBy }}
				query={GET_LIBRARY_ALBUMS}
				dataToObjectsLength={
					data => data.getLibrary.albumsPaginated?.length || 0
				}
				render={
					({ data }) => {
						if (data) {
							if (isNull(data.getLibrary.albumsPaginated)) {
								return (
									<LibraryEmpty
										name="albums"
									/>
								)
							} else {
								return (
									<Albums
										orderBy
										albums={data.getLibrary.albumsPaginated}
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
		</Head>
	)
}

interface GetLibraryAlbumsVars {
	orderBy: AlbumsOrderBy,
}

interface GetLibraryAlbumsData {
	getLibrary: LibraryAlbumsPaginated,
}

export default LibraryAlbums