import { createBEM } from "@oly_op/bem"
import { createElement, FC, ReactNode } from "react"
import { isEmpty, isFunction, isUndefined } from "lodash-es"

import {
	Playlist,
	OrderByOptions,
	ClassNamePropTypes,
	SettingsOrderByPlaylists,
} from "../../types"

import SelectOrderBy from "../select-order-by"

const bem =
	createBEM("Playlists")

const Playlists: FC<PropTypes> = ({
	orderBy,
	children,
	className,
	playlists,
}) => (
	<div
		className={bem(
			className,
			isUndefined(playlists) ?
				"Elevated" :
				!isEmpty(playlists) && "Elevated",
		)}
	>
		{orderBy && (
			<SelectOrderBy
				alwaysList
				orderBy={orderBy}
				className="PaddingHalf ItemBorder FlexRowRight"
			/>
		)}
		{isUndefined(playlists) ?
			(isFunction(children) ? null : children) :
			(isFunction(children) ? children(playlists) : null)}
	</div>
)

export interface PropTypes extends ClassNamePropTypes {
	playlists?: Playlist[],
	orderBy?: OrderByOptions<SettingsOrderByPlaylists>,
	children: ((playlists: Playlist[]) => ReactNode) | ReactNode,
}

export default Playlists