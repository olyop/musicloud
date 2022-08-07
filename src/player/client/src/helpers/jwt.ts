import jwtDecode from "jwt-decode"
import { UserID } from "@oly_op/musicloud-common/build/types"

export const getJWT =
	() =>
		localStorage.getItem("authorization")

export const removeJWT =
	() =>
		localStorage.removeItem("authorization")

export const getUserID =
	() => {
		const { userID } = jwtDecode<UserID>(getJWT()!)
		return userID
	}

export const setJWT =
	(value: string) =>
		localStorage.setItem("authorization", value)