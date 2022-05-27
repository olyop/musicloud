/* eslint-disable react/no-array-index-key */

import {
	FC,
	Ref,
	Fragment,
	useState,
	ReactNode,
	useEffect,
	useCallback,
	createElement,
} from "react"

import { DocumentNode } from "@apollo/client"

import FeedItem from "./item"
import { SettingsOrderBy } from "../../types"
import { useApolloClient } from "../../apollo"

const Feed = <ItemsTotalData, Item, ItemData, OrderBy>(
	propTypes: PropTypes<ItemsTotalData, Item, ItemData>,
): ReturnType<FC> => {
	const {
		itemQuery,
		renderItem,
		settingsOrderBy,
		itemsTotalQuery,
		itemDataToValue,
		itemsTotalDataToValue,
	} = propTypes

	const client =
		useApolloClient()

	const [ itemsTotal, setItemsTotal ] =
		useState<Total>(null)

	const getAndSetItemsTotal =
		useCallback(
			async () => {
				const { data } =
					await client.query<ItemsTotalData>({
						query: itemsTotalQuery,
					})

				if (itemsTotalDataToValue(data)) {
					setItemsTotal(itemsTotalDataToValue(data))
				}
			},
			[],
		)

	useEffect(() => {
		void getAndSetItemsTotal()
	}, [])

	if (itemsTotal) {
		const nullArray = new Array<null>(itemsTotal).fill(null)
		return (
			<Fragment>
				{nullArray.map(
					(song, index) => (
						<FeedItem<Item, ItemData, OrderBy>
							key={index}
							index={index}
							itemQuery={itemQuery}
							renderItem={renderItem}
							itemDataToValue={itemDataToValue}
							settingsOrderBy={settingsOrderBy}
						/>
					),
				)}
			</Fragment>
		)
	} else {
		return null
	}
}

type Total =
	number | null

interface PropTypes<ItemsTotalData, Item, ItemData> {
	itemQuery: DocumentNode,
	itemsTotalQuery: DocumentNode,
	settingsOrderBy: keyof SettingsOrderBy,
	itemDataToValue: (data: ItemData) => Item | null,
	itemsTotalDataToValue: (data: ItemsTotalData) => Total,
	renderItem: (ref: Ref<HTMLDivElement>, item: Item | null) => ReactNode,
}

export default Feed