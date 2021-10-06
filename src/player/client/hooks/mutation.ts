import {
	MutationHookOptions,
	useMutation as useBaseMutation,
} from "@apollo/client"

import uniqueID from "lodash/uniqueId"
import { useRef, useEffect } from "react"
import type { DocumentNode } from "graphql"

import { addLoading, useDispatch, removeLoading } from "../redux"

export const useMutation = <Data, Vars = Record<string, unknown>>(
	mutation: DocumentNode,
	{ queryID, hideLoading = false, ...options }: Options<Data, Vars> = {},
) => {
	const dispatch = useDispatch()
	const id = useRef(queryID || uniqueID())

	const tuple =
		useBaseMutation<Data, Vars>(mutation, options)

	const { loading } =
		tuple[1]

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

	return tuple
}

interface Options<Data, Vars> extends MutationHookOptions<Data, Vars> {
	queryID?: string,
	hideLoading?: boolean,
}