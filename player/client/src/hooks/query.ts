import {
	QueryResult,
	QueryHookOptions,
	OperationVariables,
	useQuery as useBaseQuery,
} from "@apollo/client"

import { useRef, useEffect } from "react"
import type { DocumentNode } from "graphql"
import { uniqueId as uniqueID } from "lodash-es"

import { addLoading, updateAccessToken, useDispatch, removeLoading } from "../redux"

export const useQuery = <Data, Vars extends OperationVariables = OperationVariables>(
	query: DocumentNode,
	{ queryID, hideLoading = false, ...options }: Options<Data, Vars> = {},
): QueryResult<Data, Vars> => {
	const dispatch = useDispatch()

	const id =
		useRef(queryID || uniqueID())

	const result =
		useBaseQuery<Data, Vars>(query, options)

	const { loading, error } =
		result

	useEffect(() => {
		if (!hideLoading) {
			if (loading) {
				dispatch(addLoading(id.current))
			} else {
				dispatch(removeLoading(id.current))
			}
		}
		return () => {
			if (!hideLoading) {
				dispatch(removeLoading(id.current))
			}
		}
	}, [loading])

	useEffect(() => {
		if (error?.message === "Token expired") {
			dispatch(updateAccessToken(null))
		}
	}, [error])

	return result
}

interface Options<Data, Vars> extends QueryHookOptions<Data, Vars> {
	queryID?: string,
	hideLoading?: boolean,
}