import { createBEM } from "@oly_op/bem"
import { isEmpty, isFunction } from "lodash-es"
import { createElement, FC, ReactNode } from "react"

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
			isEmpty(playlists) || "Elevated",
		)}
	>
		{orderBy && (
			<SelectOrderBy
				alwaysList
				orderBy={orderBy}
				className="PaddingHalf ItemBorder FlexRowRight"
			/>
		)}
		{playlists ? (
			isFunction(children) ?
				children(playlists) :
				children
		) : null}
	</div>
)

export interface PropTypes extends ClassNamePropTypes {
	playlists?: Playlist[],
	orderBy?: OrderByOptions<SettingsOrderByPlaylists>,
	children: ((playlists: Playlist[]) => ReactNode) | ReactNode,
}

export default Playlists