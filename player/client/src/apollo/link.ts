import { from } from "@apollo/client"
import { head, isNull } from "lodash-es"
import { onError } from "@apollo/client/link/error"
import { setContext } from "@apollo/client/link/context"
import createUploadLink from "apollo-upload-client/public/createUploadLink"

import { store, dispatch, updateIsOnline, updateAccessToken } from "../redux"

const uploadLink =
	createUploadLink()

const setAuthorizationLink =
	setContext(
		(_request, { headers }: { headers: Record<string, unknown> }) => {
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

const checkAuthenticationLink =
	onError(
		({ forward, operation, networkError, graphQLErrors }) => {
			if (networkError) {
				dispatch(updateIsOnline(false))
			} else if (graphQLErrors) {
				const error = head(graphQLErrors)
				if (error) {
					const { code } = error.extensions
					if (code === "UNAUTHENTICATED") {
						dispatch(updateAccessToken(null))
					}
				}
			}
			forward(operation)
		},
	)

const link =
	from([
		setAuthorizationLink,
		checkAuthenticationLink,
		uploadLink,
	])

export default link