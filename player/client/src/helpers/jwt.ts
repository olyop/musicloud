import jwtDecode from "jwt-decode"
import { UserID } from "@oly_op/musicloud-common"

export const getJWT =
	() =>
		localStorage.getItem("authorization")

export const removeJWT =
	() =>
		localStorage.removeItem("authorization")

export const getUserID =
	() =>
		jwtDecode<UserID>(getJWT()!).userID

export const setJWT =
	(value: string) =>
		localStorage.setItem("authorization", value)