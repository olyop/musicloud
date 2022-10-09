import { InLibraryObjects } from "../../types";

const determineReturn =
	(object: InLibraryObjects) =>
	<T>(song: T, artist: T, playlist: T): T => {
		const { __typename } = object;
		if (__typename === "Song") {
			return song;
		} else if (__typename === "Artist") {
			return artist;
		} else if (__typename === "Playlist") {
			return playlist;
		} else {
			throw new Error("Invald typename");
		}
	};

export default determineReturn;
