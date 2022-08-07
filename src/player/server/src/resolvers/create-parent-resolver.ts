import { GraphQLError } from "graphql"
import { ApolloServerErrorCode } from "@apollo/server/errors"
import { createRootResolver } from "@oly_op/graphql-create-resolver"

import { Context, ContextAuthorizationValidationProblem } from "../types"

const createParentResolver =
	createRootResolver<Context>(
		({ context: { authorization } }) => {
			if (authorization === ContextAuthorizationValidationProblem.UNAUTHORIZED) {
				throw new GraphQLError("Not Authorized", {
					extensions: {
						code: ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED,
					},
				})
			} else if (authorization === ContextAuthorizationValidationProblem.EXPIRED_TOKEN) {
				throw new GraphQLError("Access Token Expired", {
					extensions: {
						code: ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED,
					},
				})
			}
		},
	)

export default createParentResolver