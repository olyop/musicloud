import jwtDecode from "jwt-decode"
import { UserID } from "@oly_op/music-app-common/types"

import { useStateAccessToken } from "../redux"

export const useUserID =
	() => {
		const accessToken = useStateAccessToken()!
		return jwtDecode<UserID>(accessToken).userID
	}