/* eslint-disable @typescript-eslint/comma-dangle */
import isNull from "lodash-es/isNull";
import uniqueID from "lodash-es/uniqueId";
import { InterfaceWithInput } from "@oly_op/musicloud-common/build/types";
import { DocumentNode, useApolloClient } from "@apollo/client";
import { Ref, useCallback, useEffect, useRef, useState } from "react";

import { OrderBy, SettingsOrderBy } from "../../types";
import { useHasMounted, useInView, UseInViewOptionsOnChange } from "../../hooks";
import { addLoading, removeLoading, useDispatch, useStateOrderBy } from "../../redux";

const FeedItem = <Item, ItemData>(propTypes: PropTypes<Item, ItemData>) => {
	const { index, itemQuery, renderItem, itemDataToValue, settingsOrderBy } = propTypes;

	const dispatch = useDispatch();
	const client = useApolloClient();
	const hasMounted = useHasMounted();
	const loadingID = useRef(uniqueID());

	const orderBy = useStateOrderBy(settingsOrderBy);

	const cachedItem = useRef<Item | null>(null);

	const [item, setItem] = useState<Item | null>(null);

	const getAndSetItemAtIndex = useCallback(
		async (atIndex: number) => {
			try {
				dispatch(addLoading(loadingID.current));

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
