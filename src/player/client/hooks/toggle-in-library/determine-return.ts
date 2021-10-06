import { InLibraryObjects } from "../../types"

const determineReturn =
	({ __typename }: InLibraryObjects) =>
		<B>(song: B, artist: B, playlist: B): B => {
			if (__typename === "Song") {
				return song
			} else if (__typename === "Artist") {
				return artist
			} else {
				return playlist
			}
		}

export default determineReturn