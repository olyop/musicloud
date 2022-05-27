import { createBEM } from "@oly_op/bem"
import isFunction from "lodash-es/isFunction"
import { createElement, FC, ReactNode } from "react"

import {
	Album,
	SettingsListStyle,
	Album as AlbumType,
	AlbumsOrderByField,
	ClassNameBEMPropTypes,
} from "../../types"

import List from "../list"
import SelectOrderBy from "../select-order-by"
import { useStateListStyle } from "../../redux"

const bem =
	createBEM("Albums")

const Albums: FC<AlbumsPropTypes> = ({
	albums,
	children,
	className,
	alwaysList = false,
	hideOrderBy = false,
}) => {
	const listStyle = useStateListStyle()
	const isList = alwaysList || (listStyle === SettingsListStyle.LIST)
	return (
		<div className={bem(className, isList && albums && "Elevated")}>
			{hideOrderBy || (
				<SelectOrderBy
					orderBy={{
						key: "albums",
						fields: Object.keys(AlbumsOrderByField),
					}}
					className={bem(
						"FlexRowRight",
						isList && albums && "ItemBorder",
						isList ? "PaddingHalf" : "MarginBottom",
					)}
				/>
			)}
			<List alwaysList={alwaysList}>
				{albums ? (
					isFunction(children) ?
						children(albums) :
						children
				) : null}
			</List>
		</div>
	)
}

export interface AlbumsPropTypes extends ClassNameBEMPropTypes {
	albums?: AlbumType[],
	alwaysList?: boolean,
	hideOrderBy?: boolean,
	children: ((albums: Album[]) => ReactNode) | ReactNode,
}

export default Albums