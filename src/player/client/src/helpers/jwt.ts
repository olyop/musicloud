import { UserID } from "@oly_op/musicloud-common/build/types";
import jwtDecode from "jwt-decode";
import isNull from "lodash-es/isNull";

import { StateAccessToken } from "../types";

export const getJWT = () => localStorage.getItem("authorization");

export const removeJWT = () => localStorage.removeItem("authorization");

export const getUserID = () => {
	const { userID } = jwtDecode<UserID>(getJWT()!);
	return userID;
};

export const setJWT = (value: string) => localStorage.setItem("authorization", value);

export const verifyJWT = (value: StateAccessToken) => {
	try {
		if (isNull(value)) {
			return false;
		} else {
			const token = jwtDecode(value);
			if (token) {
				return true;
			} else {
				return false;
			}
		}
	} catch {
		return false;
	}
};
