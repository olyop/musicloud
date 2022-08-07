import { onError } from "@apollo/client/link/error"
import { setContext } from "@apollo/client/link/context"
import { from, ApolloLink, HttpLink } from "@apollo/client"

import { store, dispatch, updateIsOnline, updateAccessToken } from "../redux"

const withAuthorization =
	setContext(request => {
		const { accessToken } = store.getState()
		if (accessToken) {
			return {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		} else {
			return request
		}
	})

const checkNetworkError =
	onError(({ forward, operation, networkError }) => {
		if (networkError) {
			dispatch(updateIsOnline(false))
		}

		return forward(operation)
	})

const checkExpiredToken =
	onError(({ forward, operation, graphQLErrors }) => {
		if (graphQLErrors) {
			if (graphQLErrors[0]?.message === "Access Token Expired") {
				dispatch(updateAccessToken(null))
			}
		}

		return forward(operation)
	})

const isOnline =
	new ApolloLink((operation, forward) => (
		forward(operation).map(result => {
			dispatch(updateIsOnline(true))
			return result
		})
	))

const http =
	new HttpLink({
		useGETForQueries: true,
	})

const link =
	from([
		withAuthorization,
		checkNetworkError,
		checkExpiredToken,
		isOnline,
		http,
	])

export default link