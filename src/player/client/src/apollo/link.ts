import { ApolloLink, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

import { dispatch, store, updateAccessToken, updateIsOnline } from "../redux";

const withAuthorization = setContext(request => {
	const { accessToken } = store.getState();
	if (accessToken) {
		return {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		};
	} else {
		return request;
	}
});

const checkNetworkError = onError(({ networkError }) => {
	if (networkError) {
		dispatch(updateIsOnline(false));
	}
});

const checkExpiredToken = onError(({ graphQLErrors }) => {
	if (graphQLErrors && graphQLErrors[0]?.message === "Unauthorized") {
		dispatch(updateAccessToken(null));
	}
});

const isOnline = new ApolloLink((operation, forward) =>
	forward(operation).map(result => {
		dispatch(updateIsOnline(true));
		return result;
	}),
);

const http = new HttpLink({
	fetchOptions: {},
});

const link = from([withAuthorization, checkNetworkError, checkExpiredToken, isOnline, http]);

export default link;
