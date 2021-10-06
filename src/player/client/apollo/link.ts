import head from "lodash/head"
import isNull from "lodash/isNull"
import { onError } from "@apollo/client/link/error"
import { setContext } from "@apollo/client/link/context"
import { from, Context, HttpLink } from "@apollo/client"

import { getJWT, removeJWT } from "../helpers"

const httpLink =
	new HttpLink()

const authLink =
	setContext(
		(_request, { headers }: Context) => ({
			headers: isNull(getJWT()) ? headers : {
				...headers,
				Authorization: `Bearer ${getJWT()}`,
			},
		}),
	)

const checkForAuthErrorLink =
	onError(
		({ forward, operation, graphQLErrors }) => {
			const error = head(graphQLErrors)
			const code = error?.extensions?.code as string
			if (code === "UNAUTHENTICATED") {
				removeJWT()
				location.reload()
			} else {
				forward(operation)
			}
		},
	)

const link =
	from([
		authLink,
		checkForAuthErrorLink,
		httpLink,
	])

export default link