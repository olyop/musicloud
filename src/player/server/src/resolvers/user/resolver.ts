import { UNAUTHORIZED_ERROR } from "../../context";
import { User } from "../../types";
import createParentResolver from "../create-parent-resolver";

const resolver = createParentResolver<User>(({ parent, context }) => {
	if (parent.userID !== context.getAuthorizationJWTPayload(context.authorization).userID) {
		throw UNAUTHORIZED_ERROR;
	}
});

export default resolver;
