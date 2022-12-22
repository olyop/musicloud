import { createBEM } from "@oly_op/bem";
import isEmpty from "lodash-es/isEmpty";
import isFunction from "lodash-es/isFunction";
import isUndefined from "lodash-es/isUndefined";
import { FC, ReactNode, createElement } from "react";

import {
	ClassNamePropTypes,
	OrderByOptions,
	Playlist,
	SettingsOrderByPlaylists,
} from "../../types";
import List from "../list";
import SelectOrderBy from "../select-order-by";

const bem = createBEM("Playlists");

const Playlists: FC<PropTypes> = ({
	orderBy,
	children,
	className,
	playlists,
	hideElevated = false,
}) => (
	<div
		className={bem(
			className,
			hideElevated || (isUndefined(playlists) ? "Elevated" : !isEmpty(playlists) && "Elevated"),
		)}
	>
		{orderBy && (
			<SelectOrderBy alwaysList orderBy={orderBy} className="PaddingHalf ItemBorder FlexRowRight" />
		)}
		<List alwaysList>
			{isFunction(children) ? (isUndefined(playlists) ? playlists : children(playlists)) : children}
		</List>
	</div>
);

export interface PropTypes extends ClassNamePropTypes {
	playlists?: Playlist[];
	hideElevated?: boolean;
	orderBy?: OrderByOptions<SettingsOrderByPlaylists>;
	children: ((playlists: Playlist[]) => ReactNode) | ReactNode;
}

export default Playlists;
