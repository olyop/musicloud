/* eslint-disable react/no-array-index-key */

import { FC, Ref, useRef, useState, Fragment, useEffect, createElement } from "react";

import uniqueID from "lodash-es/uniqueId";
import type { DocumentNode } from "@apollo/client";

import { SettingsOrderBy } from "../../types";
import { useApolloClient } from "../../apollo";
import FeedItem, { FeedItemVars } from "./item";
import { useDispatch, addLoading, removeLoading } from "../../redux";

const Feed = <ItemsTotalData, Item, ItemData>(
	propTypes: PropTypes<ItemsTotalData, Item, ItemData>,
): ReturnType<FC> => {
	const {
		itemQuery,
		renderItem,
		settingsOrderBy,
		itemsTotalQuery,
		itemDataToValue,
		itemsTotalDataToValue,
	} = propTypes;

	const dispatch = useDispatch();
	const client = useApolloClient();
	const loadingID = useRef(uniqueID());

	const [itemsTotal, setItemsTotal] = useState<Total>(null);

	const getAndSetItemsTotal = async () => {
		dispatch(addLoading(loadingID.current));

		const { data } = await client.query<ItemsTotalData>({
			query: itemsTotalQuery,
			fetchPolicy: "cache-first",
		});

		const total = itemsTotalDataToValue(data);
		if (total) {
			setItemsTotal(total);
		}

		dispatch(removeLoading(loadingID.current));
	};

	useEffect(() => {
		void getAndSetItemsTotal();
	}, []);

	if (itemsTotal && itemsTotal !== 0) {
		const nullArray = new Array<null>(itemsTotal).fill(null);
		return (
			<Fragment>
				{nullArray.map((song, index) => (
					<FeedItem<Item, ItemData>
						key={index}
						index={index}
						itemQuery={itemQuery}
						renderItem={renderItem}
						itemDataToValue={itemDataToValue}
						settingsOrderBy={settingsOrderBy}
					/>
				))}
			</Fragment>
		);
	} else {
		return null;
	}
};

type Total = number | null;

interface PropTypes<ItemsTotalData, Item, ItemData> {
	itemQuery: DocumentNode;
	itemsTotalQuery: DocumentNode;
	settingsOrderBy: keyof SettingsOrderBy;
	itemDataToValue: (data: ItemData) => Item | null;
	itemsTotalDataToValue: (data: ItemsTotalData) => Total;
	renderItem: (ref: Ref<HTMLDivElement>, item: Item | null) => JSX.Element;
}

export { FeedItemVars };
export default Feed;
