/* eslint-disable react/no-array-index-key */
import { DocumentNode, useLazyQuery } from "@apollo/client";
import uniqueID from "lodash-es/uniqueId";
import { FC, Fragment, Ref, createElement, useEffect, useRef, useState } from "react";

import { addLoading, removeLoading, useDispatch } from "../../redux";
import { SettingsOrderBy } from "../../types";
import FeedItem, { FeedItemVars } from "./item";

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
	const loadingID = useRef(uniqueID());

	const [itemsTotal, setItemsTotal] = useState<Total>(null);

	const [getItemsTotal] = useLazyQuery<ItemsTotalData>(itemsTotalQuery, {
		fetchPolicy: "cache-and-network",
	});

	const getAndSetItemsTotal = async () => {
		try {
			dispatch(addLoading(loadingID.current));

			const { data } = await getItemsTotal();

			if (data) {
				const total = itemsTotalDataToValue(data);

				if (total) {
					setItemsTotal(total);
				}
			}
		} catch {
			setItemsTotal(null);
		} finally {
			dispatch(removeLoading(loadingID.current));
		}
	};

	useEffect(() => {
		void getAndSetItemsTotal();
	}, []);

	if (itemsTotal && itemsTotal !== 0) {
		// eslint-disable-next-line unicorn/no-new-array
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
