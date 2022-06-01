/* eslint-disable @typescript-eslint/comma-dangle */
import isNull from "lodash-es/isNull"
import { DocumentNode, useApolloClient } from "@apollo/client"
import { PAGINATION_PAGE_SIZE } from "@oly_op/musicloud-common"
import { createElement, Fragment, ReactNode, Ref, useCallback, useEffect, useRef, useState } from "react"

import { useStateOrderBy } from "../../redux"
import { SettingsOrderBy } from "../../types"
import { useHasMounted, useInView, UseInViewOptionsOnChange } from "../../hooks"

const FeedItem = <Item, ItemData, OrderBy>(propTypes: PropTypes<Item, ItemData>) => {
	const {
		index,
		itemQuery,
		renderItem,
		itemDataToValue,
		settingsOrderBy,
	} = propTypes

	const client = useApolloClient()
	const hasMounted = useHasMounted()

	const orderBy =
		useStateOrderBy<OrderBy>(settingsOrderBy)

	const cachedItem =
		useRef<Item | null>(null)

	const [ item, setItem ] =
		useState<Item | null>(null)

	const getAndSetItemAtIndex =
		useCallback(
			async (atIndex: number) => {
				const { data } =
					await client.query<ItemData>({
						query: itemQuery,
						variables: {
							input: {
								orderBy,
								atIndex,
							},
						},
					})

				const tempItem =
					itemDataToValue(data)

				if (!isNull(tempItem)) {
					cachedItem.current = tempItem
					setItem(tempItem)
				}
			},
			[orderBy.field, orderBy.direction],
		)

	const handleInViewChange =
		useCallback<UseInViewOptionsOnChange>(
			inView => {
				if (inView) {
					if (cachedItem.current) {
						setItem(cachedItem.current)
					} else {
						void getAndSetItemAtIndex(index)
					}
				} else {
					setItem(null)
				}
			},
			[hasMounted, cachedItem.current],
		)

	const [ ref, inView ] =
		useInView({
			onChange: handleInViewChange,
			initialInView: index < PAGINATION_PAGE_SIZE,
		})

	useEffect(() => {
		if (hasMounted && item && inView) {
			void getAndSetItemAtIndex(index)
		}
	}, [orderBy.field, orderBy.direction])

	if (index === 40) {
		console.log("FeedItem")
	}

	return (
		<Fragment>
			{renderItem(ref, item)}
		</Fragment>
	)
}

interface PropTypes<Item, ItemData> {
	index: number,
	itemQuery: DocumentNode,
	settingsOrderBy: keyof SettingsOrderBy,
	itemDataToValue: (data: ItemData) => Item | null,
	renderItem: (ref: Ref<HTMLDivElement>, item: Item | null) => ReactNode,
}

export default FeedItem