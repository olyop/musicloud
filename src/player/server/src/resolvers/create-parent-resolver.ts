import { createRootResolver } from "@oly_op/graphql-create-resolver";

import { Context } from "../context/index.js";

const createParentResolver = createRootResolver<Context>(({ context }) => {
	context.getAuthorizationJWTPayload(context.authorization);
});

export default createParentResolver;
