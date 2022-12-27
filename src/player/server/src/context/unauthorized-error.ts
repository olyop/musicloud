import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";

export class UnauthorizedError extends GraphQLError {
	constructor() {
		super("Unauthorized", {
			extensions: {
				code: ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED,
			},
		});
	}
}
