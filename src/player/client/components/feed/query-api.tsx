import uniqueID from "lodash/uniqueId"
import type { DocumentNode } from "graphql"
import { useQuery, QueryResult } from "@apollo/client"
import { useRef, useEffect, ReactNode, Fragment, createElement } from "react"

import { addLoading, useDispatch, removeLoading } from "../../redux"

const QueryApi = <Data, Vars = Record<string, unknown>>({
	query,
	children,
	variables = {} as Vars,
}: PropTypes<Data, Vars>) => {
	const dispatch = useDispatch()
	const queryID = useRef(uniqueID())

	const result =
		useQuery<Data, Vars>(query, { variables, fetchPolicy: "cache-first" })

	useEffect(() => {
		if (!result.data && result.loading) {
			dispatch(addLoading(queryID.current))
		} else {
			dispatch(removeLoading(queryID.current))
		}
		return () => {
			dispatch(removeLoading(queryID.current))
		}
	}, [result.data, result.loading])

	return (
		<Fragment>{children(result)}</Fragment>
	)
}

interface PropTypes<Data, Vars> {
	variables?: Vars,
	query: DocumentNode,
	children(res: QueryResult<Data, Vars>): ReactNode,
}

export default QueryApi