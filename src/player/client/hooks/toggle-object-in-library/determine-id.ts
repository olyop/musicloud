import { InLibraryObjects } from "../../types"

const determineID =
	(object: InLibraryObjects) => {
		if ("songID" in object) {
			return object.songID
		} else if ("artistID" in object) {
			return object.artistID
		} else {
			return object.playlistID
		}
	}

export default determineID