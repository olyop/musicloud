import { useStatePlay } from ""

export const useAudio =
	() => {
		const { songID } = song
		const play = useStatePlay()
		const volume = useStateVolume()
		const resetPlayer = useResetPlayer()
	}