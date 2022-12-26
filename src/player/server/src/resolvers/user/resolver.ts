import { UNAUTHORIZED_ERROR } from "../../context.js";
import { User } from "../../types/index.js";
import createParentResolver from "../create-parent-resolver.js";

const resolver = createParentResolver<User>(({ parent, context }) => {
	if (parent.userID !== context.getAuthorizationJWTPayload(context.authorization).userID) {
		throw UNAUTHORIZED_ERROR;
	}
});

export default resolver;
