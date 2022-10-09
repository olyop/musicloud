import jwtDecode from "jwt-decode";
import { JWTPayload } from "@oly_op/musicloud-common/build/types";

import { useStateAccessToken } from "../redux";

export const useJWTPayload = () => {
	const accessToken = useStateAccessToken()!;
	return jwtDecode<JWTPayload>(accessToken);
};
