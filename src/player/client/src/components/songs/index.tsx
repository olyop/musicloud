import { createBEM } from "@oly_op/bem";
import isEmpty from "lodash-es/isEmpty";
import isFunction from "lodash-es/isFunction";
import isUndefined from "lodash-es/isUndefined";
import { FC, ReactNode, createElement } from "react";

import { ClassNameBEMPropTypes, OrderByOptions, SettingsOrderBySongs, Song } from "../../types";
import SelectOrderBy from "../select-order-by";

const bem = createBEM("Songs");

const Songs: FC<PropTypes> = ({ songs, orderBy, children, className, hideElevated = false }) => (
	<div
		className={bem(
			className,
			!hideElevated && !isUndefined(songs) && !isEmpty(songs) && "Elevated",
		)}
	>
		{orderBy && (
			<SelectOrderBy alwaysList orderBy={orderBy} className="PaddingHalf ItemBorder FlexRowRight" />
		)}
		{isFunction(children) ? (isUndefined(songs) ? songs : children(songs)) : children}
	</div>
);

export interface PropTypes extends ClassNameBEMPropTypes {
	songs?: Song[];
	hideElevated?: boolean;
	orderBy?: OrderByOptions<SettingsOrderBySongs>;
	children: ((songs: Song[]) => ReactNode) | ReactNode;
}

export default Songs;
