import { createSigner } from "fast-jwt"
import { SearchClient } from "algoliasearch"
import { JWTPayload, UserID } from "@oly_op/music-app-common/types"

import { User } from "../../types"

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

const timeStampToDateString =
	(timeStamp: number) =>
		(new Date(timeStamp * 1000)).toLocaleDateString()

export const createJWT =
	(ag: SearchClient) =>
		({ userID, name, dateJoined, emailAddress }: User) =>
			generateJWT({
				name,
				userID,
				emailAddress,
				dateJoined: timeStampToDateString(dateJoined),
				algoliaKey: createAlgoliaAPIKey(ag)({ userID }),
			})