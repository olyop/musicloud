import { createElement, FC } from "react"
import { useParams } from "react-router-dom"
import { ArtistID } from "@oly_op/musicloud-common"
import { addDashesToUUID } from "@oly_op/uuid-dashes"

import {
	ArtistSongs,
	SongsOrderBy,
	OrderByOptions,
	SongsOrderByField,
	SettingsOrderBySongs,
} from "../../types"

import { useQuery } from "../../hooks"
import Song from "../../components/song"
import Songs from "../../components/songs"
import { useStateOrderBy } from "../../redux"
import Content from "../../components/content"
import GET_ARTIST_PAGE_SONGS from "./get-artist-page-songs.gql"

const orderBy: OrderByOptions<SettingsOrderBySongs> = {
	key: "songs",
	fields: Object.keys(SongsOrderByField),
}

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
		<Content>
			<Songs orderBy={orderBy} songs={data?.getArtistByID.songs}>
				{songs => songs.map(
					song => (
						<Song
							hidePlays
							song={song}
							hideTrackNumber
						/>
					),
				)}
			</Songs>
		</Content>
	)
}

interface ArtistPageSongsData {
	getArtistByID: ArtistSongs,
}

interface ArtistPageSongsVars extends ArtistID {
	songsOrderBy: SongsOrderBy,
}

export default ArtistPageSongs