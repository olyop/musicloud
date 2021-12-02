import { InLibraryObjects } from "../../types"

const determineReturn =
	({ __typename }: InLibraryObjects) =>
		<B>(song: B, artist: B, playlist: B): B => {
			if (__typename === "Song") {
				return song
			} else if (__typename === "Artist") {
				return artist
			} else if (__typename === "Playlist") {
				return playlist
			} else {
				throw new Error("Invald typename")
			}
		}

export default determineReturn