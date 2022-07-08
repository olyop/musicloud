import { createElement, FC } from "react"
import { useParams } from "react-router-dom"
import { ArtistID } from "@oly_op/musicloud-common"
import { addDashesToUUID } from "@oly_op/uuid-dashes"

import { useQuery } from "../../hooks"
import Song from "../../components/song"
import Songs from "../../components/songs"
import Content from "../../components/content"
import { ArtistTopTenSongs } from "../../types"
import GET_ARTIST_PAGE_HOME from "./get-artist-page-home.gql"

const ArtistPageHome: FC = () => {
	const params = useParams<keyof ArtistID>()
	const artistID = addDashesToUUID(params.artistID!)

	const { data } =
		useQuery<ArtistPageHomeData, ArtistID>(
			GET_ARTIST_PAGE_HOME,
			{ variables: { artistID } },
		)

	return (
		<Content>
			<h1 className="HeadingFive PaddingBottomHalf">
				Most Played
			</h1>
			<Songs songs={data?.getArtistByID.topTenSongs}>
				{songs => songs.map(
					song => (
						<Song
							song={song}
							hideTrackNumber
							key={song.songID}
						/>
					),
				)}
			</Songs>
		</Content>
	)
}

interface ArtistPageHomeData {
	getArtistByID: ArtistTopTenSongs,
}

export default ArtistPageHome