import { isEmpty } from "lodash-es"
import { createBEM } from "@oly_op/bem"
import { createElement, VFC } from "react"

import {
	OrderByOptions,
	SettingsListStyle,
	Artist as ArtistType,
	SettingsOrderByArtists,
} from "../../types"

import List from "../list"
import Artist from "../artist"
import SelectOrderBy from "../select-order-by"
import { useStateListStyle } from "../../redux"

const bem =
	createBEM("Artists")

const Artists: VFC<ArtistsPropTypes> = ({
	className,
	artists = [],
	orderBy = false,
}) => {
	const listStyle = useStateListStyle()
	const isList = listStyle === SettingsListStyle.LIST
	const empty = isEmpty(artists)
	return (
		<div className={bem(className, isList && !empty && "Elevated")}>
			{orderBy && (
				<SelectOrderBy
					orderBy={orderBy}
					className={bem(
						"FlexRowRight",
						isList && !empty && "ItemBorder",
						isList ? "PaddingHalf" : "MarginBottom",
					)}
				/>
			)}
			<List>
				{artists.map(
					artist => (
						<Artist
							artist={artist}
							key={artist.artistID}
						/>
					),
				)}
			</List>
		</div>
	)
}

export interface ArtistsPropTypes {
	className?: string,
	artists?: ArtistType[],
	orderBy?: OrderByOptions<SettingsOrderByArtists> | false,
}

export default Artists