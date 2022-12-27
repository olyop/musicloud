import { UnauthorizedError } from "../../context/index.js";
import { User } from "../../types/index.js";
import createParentResolver from "../create-parent-resolver.js";

const resolver = createParentResolver<User>(({ parent, context }) => {
	if (parent.userID !== context.getAuthorizationJWTPayload(context.authorization).userID) {
		throw new UnauthorizedError();
	}
});

export default resolver;
