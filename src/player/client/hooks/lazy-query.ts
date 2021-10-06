import {
	LazyQueryHookOptions,
	useLazyQuery as useBaseLazyQuery,
} from "@apollo/client"

import uniqueID from "lodash/uniqueId"
import { useRef, useEffect } from "react"
import type { DocumentNode } from "graphql"

import { addLoading, useDispatch, removeLoading } from "../redux"

export const useLazyQuery = <Data, Vars = BaseVars>(
	query: DocumentNode,
	{ hideLoading = false, ...options }: Options<Data, Vars> = {},
) => {
	const dispatch = useDispatch()
	const queryID = useRef(uniqueID())

	const tuple =
		useBaseLazyQuery<Data, Vars>(query, options)

	useEffect(() => {
		if (!hideLoading) {
			if (!tuple[1].data && tuple[1].loading) {
				dispatch(addLoading(queryID.current))
			} else {
				dispatch(removeLoading(queryID.current))
			}
		}
	}, [tuple[1].data, tuple[1].loading])

	useEffect(() => () => {
		if (!hideLoading) {
			dispatch(removeLoading(queryID.current))
		}
	})

	return tuple
}

type BaseVars =
	Record<string, unknown>

interface Options<Data, Vars> extends LazyQueryHookOptions<Data, Vars> {
	hideLoading?: boolean,
}