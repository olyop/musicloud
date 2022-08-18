import isEmpty from "lodash-es/isEmpty"
import { createBEM } from "@oly_op/bem"
import isFunction from "lodash-es/isFunction"
import isUndefined from "lodash-es/isUndefined"
import { createElement, FC, ReactNode } from "react"

import {
	Playlist,
	OrderByOptions,
	ClassNamePropTypes,
	SettingsOrderByPlaylists,
} from "../../types"

import List from "../list"
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
		<List alwaysList>
			{(isFunction(children) ?
				(isUndefined(playlists) ?
					playlists :
					children(playlists)) :
				children
			)}
		</List>
	</div>
)

export interface PropTypes extends ClassNamePropTypes {
	playlists?: Playlist[],
	orderBy?: OrderByOptions<SettingsOrderByPlaylists>,
	children: ((playlists: Playlist[]) => ReactNode) | ReactNode,
}

export default Playlists