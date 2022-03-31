import { Song } from "./song"
import { Album } from "./types"

const omitAudioFromSong =
	({ audio, ...song }: Song): Omit<Song, "audio"> =>
		song

const createFormData =
	(album: Album, songs: Song[]) => {
		const body = new FormData()

		body.append("title", album.title)
		body.append("cover", album.cover!)
		body.append("released", album.released)
		body.append("artists", JSON.stringify(album.artists))
		body.append("songs", JSON.stringify(songs.map(omitAudioFromSong)))

		for (const song of songs) {
			body.append(`${song.trackNumber}-audio`, song.audio!)
		}

		return body
	}

export default createFormData