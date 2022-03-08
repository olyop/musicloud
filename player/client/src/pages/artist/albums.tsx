import { createElement, VFC } from "react"
import { useParams } from "react-router-dom"
import { ArtistID } from "@oly_op/musicloud-common"
import { addDashesToUUID } from "@oly_op/uuid-dashes"

import {
	Artist,
	AlbumsOrderBy,
	SettingsListStyle,
	AlbumsOrderByField,
} from "../../types"

import { useQuery } from "../../hooks"
import Albums from "../../components/albums"
import { useStateListStyle, useStateOrderBy } from "../../redux"
import GET_ARTIST_PAGE_ALBUMS from "./get-artist-page-albums.gql"

const ArtistPageAlbums: VFC = () => {
	const listStyle = useStateListStyle()
	const params = useParams<keyof ArtistID>()
	const artistID = addDashesToUUID(params.artistID!)
	const isList = listStyle === SettingsListStyle.LIST
	const albumsOrderBy = useStateOrderBy<AlbumsOrderByField>("albums")

	const { data } =
		useQuery<GetArtistPageAlbumsData, GetArtistPageAlbumsVars>(
			GET_ARTIST_PAGE_ALBUMS,
			{ variables: { artistID, albumsOrderBy } },
		)

	return (
		<div className={isList ? "PaddingTopBottom" : undefined}>
			<Albums
				orderBy
				albums={data?.getArtistByID.albums}
				className={isList ? "Content" : "Padding"}
			/>
		</div>
	)
}

interface GetArtistPageAlbumsData {
	getArtistByID: Artist,
}

interface GetArtistPageAlbumsVars extends ArtistID {
	albumsOrderBy: AlbumsOrderBy,
}

export default ArtistPageAlbums