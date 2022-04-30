import isNull from "lodash-es/isNull"
import { ApolloClient } from "@apollo/client"
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common"

import GET_LIBRARY from "./get-library.gql"
import GET_ALBUM_PAGE from "../../../pages/album/get-album-page.gql"
import GET_ARTIST_PAGE from "../../../pages/artist/get-artist-page.gql"

import { Library, Song } from "../../../types"
import { createCatalogImageURL, createCatalogMP3URL } from "../../../helpers"

const downloadLibrary =
	(client: ApolloClient<unknown>) =>
		async (setSong: SetSong, setStatus: SetStatus) => {
			const { data } =
				await client.query<GetLibraryData>({
					query: GET_LIBRARY,
					fetchPolicy: "network-only",
				})

			const { songs } = data.getLibrary

			if (!isNull(songs)) {
				let songIndex = 1

				const songsLength = songs.length

				for (const song of songs) {
					setStatus([songIndex, songsLength])

					const { songID, album, artists } = song
					const { albumID, artists: albumArtists } = album

					await fetch(createCatalogMP3URL(
						songID,
					))

					await fetch(createCatalogImageURL(
						albumID,
						"cover",
						ImageSizes.MINI,
						ImageDimensions.SQUARE,
					))

					await fetch(createCatalogImageURL(
						albumID,
						"cover",
						ImageSizes.HALF,
						ImageDimensions.SQUARE,
					))

					await fetch(createCatalogImageURL(
						albumID,
						"cover",
						ImageSizes.FULL,
						ImageDimensions.SQUARE,
					))

					setSong(song)

					await client.query({
						query: GET_ALBUM_PAGE,
						variables: { albumID },
						fetchPolicy: "network-only",
					})

					for (const { artistID } of artists) {
						await client.query({
							query: GET_ARTIST_PAGE,
							variables: { artistID },
							fetchPolicy: "network-only",
						})
					}

					for (const { artistID } of albumArtists) {
						await client.query({
							query: GET_ARTIST_PAGE,
							variables: { artistID },
							fetchPolicy: "network-only",
						})

						await fetch(createCatalogImageURL(
							artistID,
							"profile",
							ImageSizes.HALF,
							ImageDimensions.SQUARE,
						))

						await fetch(createCatalogImageURL(
							artistID,
							"cover",
							ImageSizes.FULL,
							ImageDimensions.LANDSCAPE,
						))
					}

					songIndex += 1
				}
			}
		}

export type Status =
	[number, number]

type SetSong =
	(song: Song) => void

type SetStatus =
	(status: Status) => void

interface GetLibraryData {
	getLibrary: Library,
}

export default downloadLibrary