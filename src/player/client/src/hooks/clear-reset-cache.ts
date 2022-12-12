import { useApolloClient } from "@apollo/client";

// import { cachePersistor } from "../apollo";

export const useClearCache = () => {
	const client = useApolloClient();
	return async () => {
		// await cachePersistor.purge();
		await client.clearStore();
	};
};

export const useResetCache = () => {
	const client = useApolloClient();
	return async () => {
		// await cachePersistor.purge();
		await client.resetStore();
	};
};
