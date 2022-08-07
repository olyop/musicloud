import { SongBase } from "@oly_op/musicloud-common/build/types"

interface Metadata
	extends
	Pick<SongBase, "title" | "discNumber" | "trackNumber"> {
	album: string,
	artist: string,
	genres: string,
}

const getAudioMetadata =
	async (audio: File) => {
		const body = new FormData()
		body.append("audio", audio)
		const requestInit: RequestInit = { method: "PUT", body }
		const response = await fetch("/api/audio-metadata", requestInit)
		return await response.json() as Metadata
	}

export default getAudioMetadata