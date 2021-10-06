import { useDispatch, updatePlay, updateCurrent } from "../redux"

export const useResetPlayer =
	() => {
		const dispatch =
			useDispatch()

		const resetPlayer =
			() => {
				dispatch(updatePlay(false))
				dispatch(updateCurrent(0))
			}
		return resetPlayer
	}