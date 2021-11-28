import { GraphQLResolveInfo } from "graphql"
import { isNull, isUndefined } from "lodash"
import { AuthenticationError } from "apollo-server-fastify"

import { Context } from "../../types"

export interface ResolverParameter<Parent, Args> {
	args: Args,
	parent: Parent,
	context: Context,
	info: GraphQLResolveInfo,
}

export type ResolverCallback<Parent, Args, Return> =
	(props: ResolverParameter<Parent, Args>) => Return | Promise<Return>

export const createResolver =
	<Parent = undefined>() =>
		<Return, Args = undefined>(callback: ResolverCallback<Parent, Args, Return>, authenticate = true) =>
			async (parent: Parent, args: Args, context: Context, info: GraphQLResolveInfo) => {
				const { authorization } = context
				if (authenticate) {
					if (isUndefined(authorization)) {
						throw new AuthenticationError("Token not provided")
					} else if (isNull(authorization)) {
						throw new AuthenticationError("Token expired")
					}
				}
				return callback({ parent, args, context, info })
			}