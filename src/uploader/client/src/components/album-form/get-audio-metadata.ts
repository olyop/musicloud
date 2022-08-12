import { SongBase } from "@oly_op/musicloud-common/build/types"

interface Metadata
	extends
	Pick<SongBase, "mix" | "title" | "discNumber" | "trackNumber"> {
	album: string,
	genres: string[],
	artists: string[],
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