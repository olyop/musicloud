import { createElement, VFC } from "react"
import { useParams } from "react-router-dom"
import { ArtistID } from "@oly_op/musicloud-common"
import { addDashesToUUID } from "@oly_op/uuid-dashes"

import { useQuery } from "../../hooks"
import Songs from "../../components/songs"
import { ArtistTopTenSongs } from "../../types"
import GET_ARTIST_PAGE_HOME from "./get-artist-page-home.gql"

const ArtistPageHome: VFC = () => {
	const params = useParams<keyof ArtistID>()
	const artistID = addDashesToUUID(params.artistID!)

	const { data } =
		useQuery<ArtistPageHomeData, ArtistID>(
			GET_ARTIST_PAGE_HOME,
			{ variables: { artistID } },
		)

	return (
		<div className="PaddingTopBottom">
			<h1 className="HeadingFive PaddingBottomHalf Content">
				Most Played
			</h1>
			<Songs
				hideIndex
				orderBy={false}
				hideTrackNumber
				className="Content"
				songs={data?.getArtistByID.topTenSongs}
			/>
		</div>
	)
}

interface ArtistPageHomeData {
	getArtistByID: ArtistTopTenSongs,
}

export default ArtistPageHome