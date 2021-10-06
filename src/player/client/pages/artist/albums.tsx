import { createElement, FC } from "react"
import { RouteComponentProps } from "react-router-dom"
import { ArtistIDBase } from "@oly_op/music-app-common/types"

import {
	Artist,
	AlbumsOrderBy,
	SettingsListStyle,
	AlbumsOrderByField,
} from "../../types"

import { useQuery } from "../../hooks"
import Albums from "../../components/albums"
import getArtistIDFromURL from "./get-id-from-url"
import { useStateListStyle, useStateOrderBy } from "../../redux"
import GET_ARTIST_PAGE_ALBUMS from "./get-artist-page-albums.gql"

const ArtistPageAlbums: FC<RouteComponentProps> = ({ match }) => {
	const listStyle = useStateListStyle()
	const artistID = getArtistIDFromURL(match.path)
	const albumsOrderBy = useStateOrderBy<AlbumsOrderByField>("albums")

	const { data } =
		useQuery<Data, AlbumsVars>(
			GET_ARTIST_PAGE_ALBUMS,
			{ variables: { artistID, albumsOrderBy } },
		)

	return (
		<div className={listStyle === SettingsListStyle.LIST ? "PaddingTopBottom" : undefined}>
			<Albums
				albums={data?.artist.albums}
				orderByFields={Object.keys(AlbumsOrderByField)}
				className={listStyle === SettingsListStyle.LIST ? "Content" : "Padding"}
			/>
		</div>
	)
}

interface Data {
	artist: Artist,
}

interface AlbumsVars extends ArtistIDBase {
	albumsOrderBy: AlbumsOrderBy,
}

export default ArtistPageAlbums