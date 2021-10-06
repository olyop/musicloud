import { Search } from "../types"

export const __resolveType =
	(parent: Search) => {
		if ("songID" in parent) return "Song"
		else if ("genreID" in parent) return "Genre"
		else if ("albumID" in parent) return "Album"
		else if ("artistID" in parent) return "Artist"
		else if ("playlistID" in parent) return "Playlist"
		else if ("userID" in parent) return "User"
		else return undefined
	}