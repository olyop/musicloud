/* eslint-disable @typescript-eslint/comma-dangle */
import isNull from "lodash-es/isNull"
import uniqueID from "lodash-es/uniqueId"
import { InterfaceWithInput } from "@oly_op/musicloud-common"
import { DocumentNode, useApolloClient } from "@apollo/client"
import { createElement, Fragment, ReactNode, Ref, useCallback, useEffect, useRef, useState } from "react"

import { OrderBy, SettingsOrderBy } from "../../types"
import { addLoading, removeLoading, useDispatch, useStateOrderBy } from "../../redux"
import { useHasMounted, useInView, UseInViewOptionsOnChange } from "../../hooks"

const FeedItem = <Item, ItemData>(propTypes: PropTypes<Item, ItemData>) => {
	const {
		index,
		itemQuery,
		renderItem,
		itemDataToValue,
		settingsOrderBy,
	} = propTypes

	const dispatch = useDispatch()
	const client = useApolloClient()
	const hasMounted = useHasMounted()
	const loadingID = useRef(uniqueID())

	const orderBy =
		useStateOrderBy(settingsOrderBy)

	const cachedItem =
		useRef<Item | null>(null)

	const [ item, setItem ] =
		useState<Item | null>(null)

	const getAndSetItemAtIndex =
		useCallback(
			async (atIndex: number) => {
				dispatch(addLoading(loadingID.current))

				const { data } =
					await client.query<ItemData, Vars>({
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

				dispatch(removeLoading(loadingID.current))
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
		})

	useEffect(() => {
		if (hasMounted && item && inView) {
			void getAndSetItemAtIndex(index)
		}
	}, [orderBy.field, orderBy.direction])

	return (
		<Fragment>
			{renderItem(ref, item)}
		</Fragment>
	)
}

type Vars =
	InterfaceWithInput<{
		atIndex: number,
		orderBy: OrderBy,
	}>

interface PropTypes<Item, ItemData> {
	index: number,
	itemQuery: DocumentNode,
	settingsOrderBy: keyof SettingsOrderBy,
	itemDataToValue: (data: ItemData) => Item | null,
	renderItem: (ref: Ref<HTMLDivElement>, item: Item | null) => ReactNode,
}

export default FeedItem