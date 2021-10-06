import { removeJWT } from "../helpers"

export const useSignOut =
	() => () => {
		removeJWT()
		location.reload()
	}