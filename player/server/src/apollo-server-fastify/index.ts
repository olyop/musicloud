/* eslint-disable eol-last */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/quotes */
export {
	GraphQLOptions,
	Config,
	gql,
	Context,
	ContextFunction,
	PluginDefinition,
	CSRFPreventionOptions,
	// Errors
	ApolloError,
	toApolloError,
	SyntaxError,
	ValidationError,
	AuthenticationError,
	ForbiddenError,
	UserInputError,
} from 'apollo-server-core';

export {
	ApolloServer,
	ApolloFastifyConfig,
	ApolloFastifyContext,
	ApolloFastifyPluginOptions,

	// Deprecated types
	FastifyContext,
	ServerRegistration,
	ApolloServerFastifyConfig,
} from './ApolloServer';

export {
	FastifyCorsOptions,
} from '@fastify/cors';
