import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLError } from "graphql";

export class UnAuthorizedError extends GraphQLError {
	constructor() {
		super("UnAuthorized", {
			extensions: {
				code: ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED,
			},
		});
	}
}
