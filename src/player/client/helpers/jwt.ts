import jwtDecode from "jwt-decode"
import { UserIDBase } from "@oly_op/music-app-common/types"

export const getJWT =
	() =>
		localStorage.getItem("authorization")

export const removeJWT =
	() =>
		localStorage.removeItem("authorization")

export const getUserID =
	() =>
		jwtDecode<UserIDBase>(getJWT()!).userID

export const setJWT =
	(value: string) =>
		localStorage.setItem("authorization", value)