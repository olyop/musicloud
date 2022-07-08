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
	ServerRegistration,
	ApolloFastifyPluginOptions,
	ApolloServerFastifyConfig,
	FastifyContext,
} from './ApolloServer';

export { FastifyCorsOptions } from '@fastify/cors';
