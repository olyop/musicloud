import { AudioPlayerControls } from "react-use-audio-player"

import { QueueNowPlaying } from "../../types"

export type NowPlaying =
	Pick<QueueNowPlaying, "nowPlaying">["nowPlaying"]

export interface BarNowPlayingPropTypes {
	nowPlaying: NowPlaying,
}

export interface BarCommonPropTypes
	extends BarNowPlayingPropTypes {
	audio: AudioPlayerControls,
}