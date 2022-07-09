import { createBEM } from "@oly_op/bem"
import isFunction from "lodash-es/isFunction"
import isUndefined from "lodash-es/isUndefined"
import { createElement, FC, ReactNode } from "react"

import {
	Artist,
	OrderByOptions,
	SettingsListStyle,
	SettingsOrderByArtists,
} from "../../types"

import List from "../list"
import SelectOrderBy from "../select-order-by"
import { useStateListStyle } from "../../redux"

const bem =
	createBEM("Artists")

const Artists: FC<ArtistsPropTypes> = ({
	artists,
	children,
	className,
	orderBy = false,
	alwaysList = false,
}) => {
	const listStyle = useStateListStyle()
	const isList = alwaysList || (listStyle === SettingsListStyle.LIST)
	return (
		<div className={bem(className, isList && "Elevated")}>
			{orderBy && (
				<SelectOrderBy
					orderBy={orderBy}
					className={bem(
						"FlexRowRight",
						isList && artists && "ItemBorder",
						isList ? "PaddingHalf" : "MarginBottom",
					)}
				/>
			)}
			<List alwaysList={alwaysList}>
				{(isFunction(children) ?
					(isUndefined(artists) ?
						artists :
						children(artists)) :
					children
				)}
			</List>
		</div>
	)
}

export interface ArtistsPropTypes {
	artists?: Artist[],
	className?: string,
	alwaysList?: boolean,
	orderBy?: OrderByOptions<SettingsOrderByArtists> | false,
	children: ((artists: Artist[]) => ReactNode) | ReactNode,
}

export default Artists