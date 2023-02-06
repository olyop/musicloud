import { ContextGetAuthorizationJWTPayload } from "./index.js";
import { UnAuthorizedError } from "./unauthorized-error.js";

export const getAuthorizationJWTPayload: ContextGetAuthorizationJWTPayload = authorization => {
	if (authorization === false) {
		throw new UnAuthorizedError();
	} else {
		return authorization;
	}
};
