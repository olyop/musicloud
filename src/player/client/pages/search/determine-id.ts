import {
	isUser,
	isSong,
	isGenre,
	isAlbum,
	isArtist,
	isPlaylist,
} from "./is-object"

import { Search } from "../../types"

const determineID =
	(object: Search) => {
		if (isUser(object)) {
			return object.userID
		} else if (isSong(object)) {
			return object.songID
		} else if (isGenre(object)) {
			return object.genreID
		} else if (isAlbum(object)) {
			return object.albumID
		} else if (isArtist(object)) {
			return object.artistID
		} else if (isPlaylist(object)) {
			return object.playlistID
		} else {
			return ""
		}
	}

export default determineID