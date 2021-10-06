export const determineSongsSQLOrderByField =
	(field: string) => {
		if (field === "album") {
			return "albums.title"
		} else if (field === "released") {
			return "albums.released"
		} else if (field === "date_added") {
			return "library_songs.date_added"
		} else {
			return `songs.${field}`
		}
	}