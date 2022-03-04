import { updateAccessToken, useDispatch } from "../redux"

export const useSignOut =
	() => {
		const dispatch = useDispatch()
		return () => {
			dispatch(updateAccessToken(null))
		}
	}