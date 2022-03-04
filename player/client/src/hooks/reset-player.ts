import { useDispatch, updatePlay, updateCurrent } from "../redux"

export const useResetPlayer =
	() => {
		const dispatch = useDispatch()
		return () => {
			dispatch(updatePlay(false))
			dispatch(updateCurrent(0))
		}
	}