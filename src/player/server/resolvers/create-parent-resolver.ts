import { createRootResolver } from "@oly_op/graphql-create-resolver"

import { isNull, isUndefined } from "lodash-es"
import { AuthenticationError } from "apollo-server-fastify"

import { Context } from "../types"

const createParentResolver =
	createRootResolver<Context>(
		({ context: { authorization } }) => {
			if (isUndefined(authorization)) {
				throw new AuthenticationError("Token not provided")
			} else if (isNull(authorization)) {
				throw new AuthenticationError("Token expired")
			}
		},
	)

export default createParentResolver