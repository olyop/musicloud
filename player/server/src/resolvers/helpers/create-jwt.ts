import { createSigner } from "fast-jwt"
import { SearchClient } from "algoliasearch"
import { JWTPayload, JWTPayloadUser, UserID } from "@oly_op/musicloud-common"

const createAlgoliaAPIKey =
	(ag: SearchClient) =>
		({ userID }: UserID) =>
			ag.generateSecuredApiKey(
				process.env.ALGOLIA_SEARCH_API_KEY,
				{ filters: `NOT privacy:PRIVATE OR user.userID:"${userID}"` },
			)

const signer =
	createSigner({
		algorithm: "HS256",
		expiresIn: 1000 * 60 * 60 * 24,
		key: () => Promise.resolve(process.env.JWT_TOKEN_SECRET),
	})

const generateJWT =
	(payload: JWTPayload) =>
		signer(payload)

export const createJWT =
	(ag: SearchClient) =>
		({ name, userID, dateJoined, emailAddress }: JWTPayloadUser) =>
			generateJWT({
				name,
				userID,
				dateJoined,
				emailAddress,
				algoliaKey: createAlgoliaAPIKey(ag)({ userID }),
			})