import { createBEM } from "@oly_op/bem"
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
}) => {
	const listStyle = useStateListStyle()
	const isList = listStyle === SettingsListStyle.LIST
	return (
		<div className={bem(className, isList && artists && "Elevated")}>
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
			<List>
				{children(artists)}
			</List>
		</div>
	)
}

export interface ArtistsPropTypes {
	artists?: Artist[],
	className?: string,
	children: (artists?: Artist[]) => ReactNode,
	orderBy?: OrderByOptions<SettingsOrderByArtists> | false,
}

export default Artists