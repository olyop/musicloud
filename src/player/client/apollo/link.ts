import { from } from "@apollo/client"
import { head, isNull } from "lodash-es"
import { onError } from "@apollo/client/link/error"
import { createUploadLink } from "apollo-upload-client"
import { setContext } from "@apollo/client/link/context"

import { store, updateAccessToken } from "../redux"

const uploadLink =
	createUploadLink()

const authLink =
	setContext(
		(_, { headers }: { headers: Record<string, unknown> }) => {
			const { accessToken } = store.getState()
			if (isNull(accessToken)) {
				return { headers }
			} else {
				return {
					headers: {
						...headers,
						Authorization: `Bearer ${accessToken}`,
					},
				}
			}
		},
	)

const checkForAuthErrorLink =
	onError(
		({ forward, operation, graphQLErrors }) => {
			const error = head(graphQLErrors)
			const code = error!.extensions["code"] as string
			if (code === "UNAUTHENTICATED") {
				store.dispatch(updateAccessToken(null))
				forward(operation)
			} else {
				forward(operation)
			}
		},
	)

const link =
	from([
		authLink,
		checkForAuthErrorLink,
		uploadLink,
	])

export default link