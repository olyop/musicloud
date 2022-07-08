import { isNull, isUndefined } from "lodash-es"
import { AuthenticationError } from "apollo-server-errors"
import { createRootResolver } from "@oly_op/graphql-create-resolver"

import { Context } from "../types"

const createParentResolver =
	createRootResolver<Context>(
		({ context: { authorization } }) => {
			if (isUndefined(authorization)) {
				throw new AuthenticationError("Invalid token")
			} else if (isNull(authorization)) {
				throw new AuthenticationError("Expired token")
			}
		},
	)

export default createParentResolver