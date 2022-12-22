import { createBEM } from "@oly_op/bem";
import isFunction from "lodash-es/isFunction";
import isUndefined from "lodash-es/isUndefined";
import { FC, ReactNode, createElement } from "react";

import { useStateListStyle } from "../../redux";
import {
	Album,
	Album as AlbumType,
	AlbumsOrderByField,
	ClassNameBEMPropTypes,
	SettingsListStyle,
} from "../../types";
import List from "../list";
import SelectOrderBy from "../select-order-by";

const bem = createBEM("Albums");

const Albums: FC<AlbumsPropTypes> = ({
	albums,
	children,
	className,
	alwaysList = false,
	hideOrderBy = false,
}) => {
	const listStyle = useStateListStyle();
	const isList = alwaysList || listStyle === SettingsListStyle.LIST;
	return (
		<div className={bem(className, isList && "Elevated")}>
			{hideOrderBy || (
				<SelectOrderBy
					orderBy={{
						key: "albums",
						fields: Object.keys(AlbumsOrderByField),
					}}
					className={bem(
						"FlexRowRight",
						isList && "ItemBorder",
						isList ? "PaddingHalf" : "MarginBottom",
					)}
				/>
			)}
			<List alwaysList={alwaysList}>
				{isFunction(children) ? (isUndefined(albums) ? albums : children(albums)) : children}
			</List>
		</div>
	);
};

export interface AlbumsPropTypes extends ClassNameBEMPropTypes {
	albums?: AlbumType[];
	alwaysList?: boolean;
	hideOrderBy?: boolean;
	children: ((albums: Album[]) => ReactNode) | ReactNode;
}

export default Albums;
