import { Head } from "@oly_op/react-head"
import { createElement, FC } from "react"

import {
	OrderByOptions,
	Artist as ArtistType,
	SettingsOrderByArtists,
	LibraryArtistsOrderByField,
} from "../../../types"

import Feed from "../../../components/feed"
import Artist from "../../../components/artist"
import Artists from "../../../components/artists"
import GET_LIBRARY_ARTISTS_TOTAL from "./get-library-artists-total.gql"
import GET_LIBRARY_ARTIST_AT_INDEX from "./get-library-artist-at-index.gql"

import "./index.scss"

const orderBy: OrderByOptions<SettingsOrderByArtists> = {
	key: "libraryArtists",
	fields: Object.keys(LibraryArtistsOrderByField),
}

const LibrarySongs: FC = () => (
	<Head pageTitle="Library Artists">
		<Artists orderBy={orderBy} className="Content Elevated">
			<Feed<GetArtistsTotalData, ArtistType, GetArtistAtIndexData>
				settingsOrderBy="libraryArtists"
				itemQuery={GET_LIBRARY_ARTIST_AT_INDEX}
				itemsTotalQuery={GET_LIBRARY_ARTISTS_TOTAL}
				itemDataToValue={({ getLibrary }) => getLibrary.artistAtIndex}
				itemsTotalDataToValue={({ getLibrary }) => getLibrary.artistsTotal}
				renderItem={(ref, artist) => (
					<Artist
						ref={ref}
						artist={artist}
						className="LibraryArtist PaddingHalf ItemBorder"
					/>
				)}
			/>
		</Artists>
	</Head>
)

interface GetArtistsTotalData {
	getLibrary: {
		artistsTotal: number | null,
	},
}

interface GetArtistAtIndexData {
	getLibrary: {
		artistAtIndex: ArtistType | null,
	},
}

export default LibrarySongs