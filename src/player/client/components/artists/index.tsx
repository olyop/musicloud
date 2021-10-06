import isEmpty from "lodash/isEmpty"
import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"

import {
	SettingsOrderBy,
	SettingsListStyle,
	Artist as ArtistType,
} from "../../types"

import List from "../list"
import Artist from "../artist"
import SelectOrderBy from "../select-order-by"
import { useStateListStyle } from "../../redux"

const bem =
	createBEM("Artists")

const Artists: FC<PropTypes> = ({
	className,
	orderByKey,
	artists = [],
	orderByFields,
	hideOrderBy = false,
}) => {
	const listStyle = useStateListStyle()
	const isList = listStyle === SettingsListStyle.LIST
	const empty = isEmpty(artists)
	return (
		<div className={bem(className, isList && !empty && "Elevated")}>
			{hideOrderBy || (
				<SelectOrderBy
					settingsKey={orderByKey!}
					fieldOptions={orderByFields!}
					className={bem(
						"FlexListRight",
						isList && !empty && "ItemBorder",
						isList ? "PaddingHalf" : "MarginBottomHalf",
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

interface PropTypes {
	className?: string,
	hideOrderBy?: boolean,
	artists?: ArtistType[],
	orderByFields?: string[],
	orderByKey?: keyof Pick<SettingsOrderBy, "artists" | "libraryArtists">,
}

export default Artists