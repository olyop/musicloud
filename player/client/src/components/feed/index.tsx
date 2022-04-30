import {
	useRef,
	Fragment,
	useEffect,
	ReactNode,
	createElement,
} from "react"

import uniqueID from "lodash-es/uniqueId"
import { Waypoint } from "react-waypoint"
import type { DocumentNode } from "graphql"
import { QueryResult } from "@apollo/client"
import { InterfaceWithInput, PAGINATION_PAGE_SIZE } from "@oly_op/musicloud-common"

import QueryApi from "./query-api"
import { addLoading, useDispatch, removeLoading } from "../../redux"

const queryID =
	uniqueID()

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

	const handleAddLoading =
		() => {
			dispatch(addLoading(queryID))
		}

	const handleRemoveLoading =
		() => {
			dispatch(removeLoading(queryID))
		}

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
									page.current += 1
									handleAddLoading()
									void result.fetchMore({
										variables: {
											...result.variables,
											input: {
												...result.variables!.input,
												page: page.current,
											},
										},
									}).then(handleRemoveLoading)
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