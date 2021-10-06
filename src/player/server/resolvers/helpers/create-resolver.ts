import { isNull, isUndefined } from "lodash"
import { AuthenticationError } from "apollo-server-fastify"

import { Context, ResolverParameter } from "../../types"

export const createResolver =
	<P = undefined>() =>
		<R, A = undefined>(callback: Callback<P, R, A>, authenticate = true) =>
			async (parent: P, args: A, context: Context) => {
				const { authorization } = context
				if (authenticate) {
					if (isUndefined(authorization)) {
						throw new AuthenticationError("Token not provided.")
					} else if (isNull(authorization)) {
						throw new AuthenticationError("Token expired.")
					}
				}
				return callback({ parent, args, context })
			}

type Callback<P, R, A> =
	(props: ResolverParameter<P, A>) => R | Promise<R>