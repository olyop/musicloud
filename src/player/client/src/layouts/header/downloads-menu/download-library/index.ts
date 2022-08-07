// import isNull from "lodash-es/isNull"
// import { ApolloClient } from "@apollo/client"

// import downloadArtists from "./artists"
// import downloadSongMP3 from "./song-mp3"
// import GET_LIBRARY from "../get-library.gql"
// import downloadAlbumCovers from "./album-covers"
// import { Library, Song } from "../../../../types"

// const downloadLibrary =
// 	(client: ApolloClient<unknown>) =>
// 		async (setSong: SetSong, setStatus: SetStatus) => {
// 			const { data: { getLibrary: { songs } } } =
// 				await client.query<GetLibraryData>({
// 					query: GET_LIBRARY,
// 					fetchPolicy: "network-only",
// 				})

// 			if (!isNull(songs)) {
// 				let songIndex = 1

// 				for (const song of songs) {
// 					setStatus([ songIndex, songs.length ])

// 					const { songID, album, artists, remixers, featuring } = song
// 					const { albumID, artists: albumArtists } = album

// 					setSong(song)

// 					await downloadArtists(artists)
// 					await downloadArtists(remixers)
// 					await downloadArtists(featuring)
// 					await downloadSongMP3({ songID })
// 					await downloadArtists(albumArtists)
// 					await downloadAlbumCovers({ albumID })

// 					songIndex += 1
// 				}
// 			}
// 		}

// export type Status =
// 	[number, number]

// type SetSong =
// 	(song: Song) => void

// type SetStatus =
// 	(status: Status) => void

// interface GetLibraryData {
// 	getLibrary: Library,
// }

// export default downloadLibrary