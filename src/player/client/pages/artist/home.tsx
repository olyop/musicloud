import { createElement, VFC } from "react"
import { useParams } from "react-router-dom"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import { ArtistIDBase } from "@oly_op/music-app-common/types"

import { useQuery } from "../../hooks"
import Songs from "../../components/songs"
import { ArtistTopTenSongs } from "../../types"
import GET_ARTIST_PAGE_HOME from "./get-artist-page-home.gql"

const ArtistPageHome: VFC = () => {
	const params = useParams<keyof ArtistIDBase>()
	const artistID = addDashesToUUID(params.artistID!)

	const { data } =
		useQuery<ArtistPageHomeData, ArtistIDBase>(
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