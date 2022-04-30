import { SongBase } from "@oly_op/musicloud-common"

interface Metadata
	extends
	Pick<SongBase, "title" | "discNumber" | "trackNumber"> {
	genres: string,
}

const getAudioMetadata =
	async (audio: File) => {
		const body = new FormData()
		body.append("audio", audio)
		const requestInit: RequestInit = { method: "PUT", body }
		const response = await fetch("/audio-metadata", requestInit)
		return await response.json() as Metadata
	}

export default getAudioMetadata