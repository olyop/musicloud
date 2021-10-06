import { Song } from "../../types"

export const addQueueIndexToSongs =
	(songs: Song[]) =>
		songs.map<Song>(
			(song, queueIndex) => ({
				...song,
				queueIndex,
			}),
		)