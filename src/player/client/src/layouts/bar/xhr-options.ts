import { useAudioPlayer as useAudio } from "react-use-audio-player";

const XHR_OPTIONS: NonNullable<Parameters<typeof useAudio>[0]>["xhr"] = {
	headers: {
		// For Workbox, even though CORS is setup.
		"Access-Control-Allow-Origin": "*",
	},
};

export default XHR_OPTIONS;
