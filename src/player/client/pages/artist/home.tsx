import { createElement, FC } from "react"
import { RouteComponentProps } from "react-router-dom"
import { ArtistIDBase } from "@oly_op/music-app-common/types"

import { Artist } from "../../types"
import { useQuery } from "../../hooks"
import Songs from "../../components/songs"
import getArtistIDFromURL from "./get-id-from-url"
import GET_ARTIST_PAGE_HOME from "./get-artist-page-home.gql"

const ArtistPageHome: FC<RouteComponentProps> = ({ match }) => {
	const artistID = getArtistIDFromURL(match.path)

	const { data } =
		useQuery<Data, ArtistIDBase>(
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
				hideCover
				hideOrderBy
				hideTrackNumber
				orderByKey="songs"
				className="Content"
				songs={data?.artist.topTenSongs}
			/>
		</div>
	)
}

interface Data {
	artist: Artist,
}

export default ArtistPageHome