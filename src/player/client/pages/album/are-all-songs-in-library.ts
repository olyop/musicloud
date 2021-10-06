import { Song } from "../../types"

const areAllSongsInLibrary =
	(songs: Song[]) =>
		songs.map(({ inLibrary }) => inLibrary)
				 .every(Boolean)

export default areAllSongsInLibrary