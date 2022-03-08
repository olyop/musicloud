import {
	useRef,
	Fragment,
	useEffect,
	ReactNode,
	createElement,
} from "react"

import { Waypoint } from "react-waypoint"
import type { DocumentNode } from "graphql"
import { QueryResult } from "@apollo/client"
import { uniqueId as uniqueID } from "lodash-es"
import { InterfaceWithInput, PAGINATION_PAGE_SIZE } from "@oly_op/musicloud-common"

import { addLoading, useDispatch, removeLoading } from "../../redux"

import QueryApi from "./query-api"

const isNotLastPage =
	(objectsLength: number, page: number) =>
		objectsLength === (
			(page * PAGINATION_PAGE_SIZE) +
			PAGINATION_PAGE_SIZE
		)

const Feed = <Data, Vars>({
	query,
	render,
	dataToObjectsLength,
	variables = {} as Vars,
}: PropTypes<Data, Vars>) => {
	const page = useRef(0)
	const dispatch = useDispatch()

	useEffect(() => () => {
		page.current = 0
	})

	return (
		<QueryApi<Data, InputVars<Vars>>
			query={query}
			variables={{
				input: {
					...variables,
					page: page.current,
				},
			}}
			children={result => (
				<Fragment>
					{render(result)}
					{result.data && (
						<Waypoint
							onEnter={() => {
								if (isNotLastPage(dataToObjectsLength(result.data!), page.current)) {
									const queryID = uniqueID()
									page.current += 1
									dispatch(addLoading(queryID))
									void result.fetchMore({
										variables: {
											...result.variables,
											input: {
												...result.variables!.input,
												page: page.current,
											},
										},
									}).then(() => dispatch(removeLoading(queryID)))
								}
							}}
						/>
					)}
				</Fragment>
			)}
		/>
	)
}

export interface BaseVars {
	page: number,
}

type InputVars<Vars> =
	InterfaceWithInput<BaseVars & Vars>

interface PropTypes<Data, Vars> {
	variables?: Vars,
	query: DocumentNode,
	dataToObjectsLength: (data: Data) => number,
	render: (result: QueryResult<Data, InputVars<Vars>>) => ReactNode,
}

export default Feed