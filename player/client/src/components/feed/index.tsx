import uniqueID from "lodash-es/uniqueId"
import type { DocumentNode } from "graphql"
import InfiniteScroll from "react-infinite-scroller"
import { QueryResult, useLazyQuery } from "@apollo/client"
import { ComponentProps, ReactNode, createElement, useEffect } from "react"
import { InterfaceWithInput, PAGINATION_PAGE_SIZE } from "@oly_op/musicloud-common"

import { addLoading, useDispatch, removeLoading } from "../../redux"

const queryID =
	uniqueID()

const isLastPage =
	(objectsLength: number, page: number) =>
		objectsLength !== (
			(page * PAGINATION_PAGE_SIZE) +
			PAGINATION_PAGE_SIZE
		)

const Feed = <Data, GenericVars>({
	query,
	render,
	scrollElement,
	dataToObjectsLength,
	variables: baseVariables = {} as GenericVars,
}: PropTypes<Data, GenericVars>) => {
	const dispatch = useDispatch()

	type Vars =
		InputVars<GenericVars>

	const [ lazyQuery, result ] =
		useLazyQuery<Data, Vars>(query, {
			variables: {
				input: {
					...(baseVariables || {} as GenericVars),
					page: 0,
				},
			},
		})

	const handleAddLoading =
		() => {
			dispatch(addLoading(queryID))
		}

	const handleRemoveLoading =
		() => {
			dispatch(removeLoading(queryID))
		}

	const handleLoadMore: HandleLoadMore =
		page => {
			console.log({ page })
			if (result.data) {
				handleAddLoading()
				if (!isLastPage(dataToObjectsLength(result.data), page)) {
					void result.fetchMore({
						variables: {
							input: {
								...baseVariables,
								page,
							},
						},
					}).then(handleRemoveLoading)
				}
			}
		}

	useEffect(() => {
		void lazyQuery({
			variables: {
				input: {
					...(baseVariables || {} as GenericVars),
					page: 0,
				},
			},
		}).then(handleRemoveLoading)
	}, [])

	return result.data ? (
		<InfiniteScroll
			hasMore
			useWindow={false}
			loadMore={handleLoadMore}
			children={render(result)}
			getScrollParent={() => scrollElement}
		/>
	) : null
}

export interface BaseVars {
	page: number,
}

type InputVars<GenericVars> =
	InterfaceWithInput<BaseVars & GenericVars>

type HandleLoadMore =
	ComponentProps<typeof InfiniteScroll>["loadMore"]

interface PropTypes<Data, GenericVars> {
	query: DocumentNode,
	variables?: GenericVars,
	scrollElement: HTMLElement | null,
	dataToObjectsLength: (data: Data) => number,
	render: (result: QueryResult<Data, InputVars<GenericVars>>) => ReactNode,
}

export default Feed