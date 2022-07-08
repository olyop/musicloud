export const determineSongsSQLOrderByField =
	(field: string) => {
		const fieldLowerCase = field.toLowerCase()
		if (fieldLowerCase === "album") {
			return "albums.title"
		} else if (fieldLowerCase === "released") {
			return "albums.released"
		} else if (fieldLowerCase === "date_added") {
			return "library_songs.date_added"
		} else {
			return `songs.${fieldLowerCase}`
		}
	}