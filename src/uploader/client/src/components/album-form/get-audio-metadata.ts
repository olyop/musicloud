import type { ConnectionError } from "fastify";
import { SongAudioMetadataBase } from "@oly_op/musicloud-common/build/types";

interface SongAudioMetadata extends SongAudioMetadataBase {
	cover: ConnectionError["rawPacket"] | null;
}

const getAudioMetadata = async (audio: File) => {
	const body = new FormData();
	body.append("audio", audio);

	const requestInit: RequestInit = {
		method: "PUT",
		body,
		headers: {
			Authorization: `Bearer ${localStorage.getItem("authorization")!}`,
		},
	};

	const response = await fetch("/api/audio-metadata", requestInit);

	return (await response.json()) as SongAudioMetadata;
};

export default getAudioMetadata;
