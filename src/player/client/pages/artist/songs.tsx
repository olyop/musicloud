import { createElement, FC } from "react"
import { RouteComponentProps } from "react-router-dom"
import { ArtistIDBase } from "@oly_op/music-app-common/types"

import { useQuery } from "../../hooks"
import Songs from "../../components/songs"
import { useStateOrderBy } from "../../redux"
import getArtistIDFromURL from "./get-id-from-url"
import GET_ARTIST_PAGE_SONGS from "./get-artist-page-songs.gql"
import { Artist, SongsOrderBy, SongsOrderByField } from "../../types"

const ArtistPageSongs: FC<RouteComponentProps> = ({ match }) => {
	const artistID = getArtistIDFromURL(match.path)
	const songsOrderBy = useStateOrderBy<SongsOrderByField>("songs")

	const { data } =
		useQuery<Data, SongsVars>(
			GET_ARTIST_PAGE_SONGS,
			{ variables: { artistID, songsOrderBy } },
		)

	return (
		<div className="PaddingTopBottom">
			<Songs
				hidePlays
				hideIndex
				hideTrackNumber
				orderByKey="songs"
				className="Content"
				songs={data?.artist.songs}
				orderByFields={Object.keys(SongsOrderByField)}
			/>
		</div>
	)
}

interface Data {
	artist: Artist,
}

interface SongsVars extends ArtistIDBase {
	songsOrderBy: SongsOrderBy,
}

export default ArtistPageSongs