import isEmpty from "lodash-es/isEmpty"
import { createBEM } from "@oly_op/bem"
import { isUndefined } from "lodash-es"
import isFunction from "lodash-es/isFunction"
import { createElement, FC, ReactNode } from "react"

import SelectOrderBy from "../select-order-by"
import { ClassNameBEMPropTypes, OrderByOptions, SettingsOrderBySongs, Song } from "../../types"

const bem =
	createBEM("Songs")

const Songs: FC<PropTypes> = ({
	songs,
	orderBy,
	children,
	className,
	hideElevated = false,
}) => (
	<div
		className={bem(
			className,
			!hideElevated &&
			!isEmpty(songs) &&
			"Elevated",
		)}
	>
		{orderBy && (
			<SelectOrderBy
				alwaysList
				orderBy={orderBy}
				className="PaddingHalf ItemBorder FlexRowRight"
			/>
		)}
		{(isFunction(children) ?
			(isUndefined(songs) ?
				songs :
				children(songs)) :
			children
		)}
	</div>
)

export interface PropTypes extends ClassNameBEMPropTypes {
	songs?: Song[],
	hideElevated?: boolean,
	orderBy?: OrderByOptions<SettingsOrderBySongs>,
	children: ((songs: Song[]) => ReactNode) | ReactNode,
}

export default Songs