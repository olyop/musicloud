import {
	DocumentNode,
	OperationVariables,
	QueryHookOptions,
	QueryResult,
	useQuery as useBaseQuery,
} from "@apollo/client";
import uniqueID from "lodash-es/uniqueId";
import { useEffect, useRef } from "react";

import { addLoading, removeLoading, updateAccessToken, useDispatch } from "../redux";

export const useQuery = <Data, Vars extends OperationVariables = OperationVariables>(
	query: DocumentNode,
	{ queryID, hideLoading = false, ...options }: Options<Data, Vars> = {},
): QueryResult<Data, Vars> => {
	const dispatch = useDispatch();

	const id = useRef(queryID || uniqueID());

	const { loading, ...result } = useBaseQuery<Data, Vars>(query, options);

	useEffect(() => {
		if (!hideLoading) {
			if (loading) {
				dispatch(addLoading(id.current));
			} else {
				dispatch(removeLoading(id.current));
			}
		}
		return () => {
			if (!hideLoading) {
				dispatch(removeLoading(id.current));
			}
		};
	}, [loading]);

	useEffect(() => {
		if (result.error?.message === "Token expired") {
			dispatch(updateAccessToken(null));
		}
	}, [result.error]);

	return {
		...result,
		loading,
	};
};

interface Options<Data, Vars> extends QueryHookOptions<Data, Vars> {
	queryID?: string;
	hideLoading?: boolean;
}
