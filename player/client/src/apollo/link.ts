import { from, ApolloLink } from "@apollo/client"
import { onError } from "@apollo/client/link/error"
import { createUploadLink } from "apollo-upload-client"
import { setContext } from "@apollo/client/link/context"

import { store, dispatch, updateIsOnline, updateAccessToken } from "../redux"

const withAuthorization =
	setContext(
		() => {
			const { accessToken } = store.getState()
			return {
				headers: {
					Authorization: `Bearer ${accessToken!}`,
				},
			}
		},
	)

const checkAuthenticationLink =
	onError(
		({ forward, operation, networkError, graphQLErrors }) => {
			if (networkError) {
				dispatch(updateIsOnline(false))
			}

			if (graphQLErrors) {
				if (graphQLErrors[0]?.extensions["code"] === "UNAUTHENTICATED") {
					dispatch(updateAccessToken(null))
				}
			}

			return forward(operation)
		},
	)

const isOnlineLink =
	new ApolloLink(
		(operation, forward) => (
			forward(operation).map(data => {
				dispatch(updateIsOnline(true))
				return data
			})
		),
	)

const uploadLink =
	createUploadLink()

const link =
	from([
		withAuthorization,
		checkAuthenticationLink,
		isOnlineLink,
		uploadLink,
	])

export default link