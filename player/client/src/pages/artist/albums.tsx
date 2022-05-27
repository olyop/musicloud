import { createElement, FC } from "react"
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
import Album from "../../components/album"
import Albums from "../../components/albums"
import Content from "../../components/content"
import { useStateListStyle, useStateOrderBy } from "../../redux"

import GET_ARTIST_PAGE_ALBUMS from "./get-artist-page-albums.gql"

const ArtistPageAlbums: FC = () => {
	const listStyle = useStateListStyle()
	const params = useParams<keyof ArtistID>()
	const artistID = addDashesToUUID(params.artistID!)
	const isList = listStyle === SettingsListStyle.LIST

	const orderBy =
		useStateOrderBy<AlbumsOrderByField>("albums")

	const { data } =
		useQuery<GetArtistPageAlbumsData, GetArtistPageAlbumsVars>(
			GET_ARTIST_PAGE_ALBUMS,
			{ variables: { artistID, orderBy } },
		)

	const className =
		isList ? "Content" : "Padding"

	return (
		<Content className={isList ? "PaddingTopBottom" : undefined}>
			<Albums albums={data?.getArtistByID.albums} className={className}>
				{albums => (
					albums.map(
						album => (
							<Album
								album={album}
								key={album.albumID}
							/>
						),
					)
				)}
			</Albums>
		</Content>
	)
}

interface GetArtistPageAlbumsData {
	getArtistByID: Artist,
}

interface GetArtistPageAlbumsVars extends ArtistID {
	orderBy: AlbumsOrderBy,
}

export default ArtistPageAlbums