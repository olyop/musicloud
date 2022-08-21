import ms from "ms"
import { createSigner } from "fast-jwt"
import { SearchClient } from "algoliasearch"
import { JWT_ALGORITHM } from "@oly_op/musicloud-common/build/globals"
import { JWTPayload, JWTPayloadUser, UserID } from "@oly_op/musicloud-common/build/types"

const signer =
	createSigner({
		expiresIn: ms("1d"),
		algorithm: JWT_ALGORITHM,
		key: () => Promise.resolve(process.env.JWT_TOKEN_SECRET),
	})

const createAlgoliaAPIKey =
	(ag: SearchClient) =>
		({ userID }: UserID) =>
			ag.generateSecuredApiKey(process.env.ALGOLIA_SEARCH_API_KEY, {
				filters: `NOT privacy:PRIVATE OR user.userID:"${userID}"`,
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