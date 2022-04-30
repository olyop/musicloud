import { createElement, FC } from "react"
import { useParams } from "react-router-dom"
import { ArtistID } from "@oly_op/musicloud-common"
import { addDashesToUUID } from "@oly_op/uuid-dashes"

import { useQuery } from "../../hooks"
import Songs from "../../components/songs"
import { useStateOrderBy } from "../../redux"
import GET_ARTIST_PAGE_SONGS from "./get-artist-page-songs.gql"
import { ArtistSongs, SongsOrderBy, SongsOrderByField } from "../../types"

const ArtistPageSongs: FC = () => {
	const params = useParams<keyof ArtistID>()
	const artistID = addDashesToUUID(params.artistID!)
	const songsOrderBy = useStateOrderBy<SongsOrderByField>("songs")

	const { data } =
		useQuery<ArtistPageSongsData, ArtistPageSongsVars>(
			GET_ARTIST_PAGE_SONGS,
			{ variables: { artistID, songsOrderBy } },
		)

	return (
		<div className="PaddingTopBottom">
			<Songs
				hidePlays
				hideIndex
				hideTrackNumber
				className="Content"
				songs={data?.getArtistByID.songs}
				orderBy={{
					key: "songs",
					fields: Object.keys(SongsOrderByField),
				}}
			/>
		</div>
	)
}

interface ArtistPageSongsData {
	getArtistByID: ArtistSongs,
}

interface ArtistPageSongsVars extends ArtistID {
	songsOrderBy: SongsOrderBy,
}

export default ArtistPageSongs