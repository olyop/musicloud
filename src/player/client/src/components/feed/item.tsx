/* eslint-disable @typescript-eslint/comma-dangle */
import { DocumentNode, useApolloClient } from "@apollo/client";
import { InterfaceWithInput } from "@oly_op/musicloud-common/build/types";
import isNull from "lodash-es/isNull";
import uniqueID from "lodash-es/uniqueId";
// import ms from "ms";
import { Ref, useCallback, useEffect, useRef, useState } from "react";

import { UseInViewOptionsOnChange, useHasMounted, useInView } from "../../hooks";
import { addLoading, removeLoading, useDispatch, useStateOrderBy } from "../../redux";
import { OrderBy, SettingsOrderBy } from "../../types";

// const sleepTime = ms("30ms");

// const sleep = () =>
// 	new Promise(resolve => {
// 		setTimeout(resolve, sleepTime);
// 	});

const FeedItem = <Item, ItemData>(propTypes: PropTypes<Item, ItemData>) => {
	const { index, itemQuery, renderItem, itemDataToValue, settingsOrderBy } = propTypes;

	const dispatch = useDispatch();
	const client = useApolloClient();
	const hasMounted = useHasMounted();
	const loadingID = useRef(uniqueID());
	const cachedItem = useRef<Item | null>(null);
	const orderBy = useStateOrderBy(settingsOrderBy);

	const [item, setItem] = useState<Item | null>(null);

	const getAndSetItemAtIndex = useCallback(
		async (atIndex: number) => {
			try {
				dispatch(addLoading(loadingID.current));

				// await sleep();

				const { data } = await client.query<ItemData, FeedItemVars>({
					query: itemQuery,
					variables: {
						input: {
							orderBy,
							atIndex,
						},
					},
				});

				const tempItem = itemDataToValue(data);

				if (!isNull(tempItem)) {
					cachedItem.current = tempItem;
					setItem(tempItem);
				}
			} catch {
				setItem(null);
			} finally {
				dispatch(removeLoading(loadingID.current));
			}
		},
		[orderBy.field, orderBy.direction],
	);

	const handleInViewChange = useCallback<UseInViewOptionsOnChange>(
		inView => {
			if (inView) {
				if (cachedItem.current) {
					setItem(cachedItem.current);
				} else {
					void getAndSetItemAtIndex(index);
				}
			} else {
				setItem(null);
			}
		},
		[hasMounted, cachedItem.current],
	);

	const [ref, inView] = useInView({
		onChange: handleInViewChange,
	});

	useEffect(() => {
		if (hasMounted) {
			if (item && inView) {
				void getAndSetItemAtIndex(index);
			}
			cachedItem.current = null;
		}
	}, [orderBy.field, orderBy.direction]);

	return renderItem(ref, item);
};

export type FeedItemVars = InterfaceWithInput<{
	atIndex: number;
	orderBy: OrderBy;
}>;

interface PropTypes<Item, ItemData> {
	index: number;
	itemQuery: DocumentNode;
	settingsOrderBy: keyof SettingsOrderBy;
	itemDataToValue: (data: ItemData) => Item | null;
	renderItem: (ref: Ref<HTMLDivElement>, item: Item | null) => JSX.Element;
}

export default FeedItem;
