import { createBEM } from "@oly_op/bem"
import { Head } from "@oly_op/react-head"
import { createElement, FC } from "react"

import Feed from "../../../components/feed"
import Album from "../../../components/album"
import Albums from "../../../components/albums"
import { useStateListStyle } from "../../../redux"
import { Album as AlbumType, SettingsListStyle } from "../../../types"

import GET_LIBRARY_ALBUMS_TOTAL from "./get-library-albums-total.gql"
import GET_LIBRARY_ALBUM_AT_INDEX from "./get-library-album-at-index.gql"

import "./index.scss"

const bem =
	createBEM("LibraryAlbum")

const LibraryAlbums: FC = () => {
	const listStyle = useStateListStyle()
	const isList = listStyle === SettingsListStyle.LIST
	return (
		<Head pageTitle="Library Albums">
			<Albums className={bem(isList ? "Content" : "PaddingLeftRight")}>
				<Feed<GetAlbumsTotalData, AlbumType, GetAlbumAtIndexData>
					settingsOrderBy="albums"
					itemQuery={GET_LIBRARY_ALBUM_AT_INDEX}
					itemsTotalQuery={GET_LIBRARY_ALBUMS_TOTAL}
					itemDataToValue={({ getLibrary }) => getLibrary.albumAtIndex}
					itemsTotalDataToValue={({ getLibrary }) => getLibrary.albumsTotal}
					renderItem={(ref, album) => (
						<Album
							ref={ref}
							album={album}
							className={bem(
								isList && "list",
								isList && "PaddingHalf ItemBorder",
							)}
						/>
					)}
				/>
			</Albums>
		</Head>
	)
}

interface GetAlbumsTotalData {
	getLibrary: {
		albumsTotal: number | null,
	},
}

interface GetAlbumAtIndexData {
	getLibrary: {
		albumAtIndex: AlbumType | null,
	},
}

export default LibraryAlbums