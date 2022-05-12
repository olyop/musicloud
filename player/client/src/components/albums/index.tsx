import isEmpty from "lodash-es/isEmpty"
import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"

import {
	SettingsListStyle,
	Album as AlbumType,
	AlbumsOrderByField,
	ClassNameBEMPropTypes,
} from "../../types"

import List from "../list"
import Album from "../album"
import SelectOrderBy from "../select-order-by"
import { useStateListStyle } from "../../redux"

const bem =
	createBEM("Albums")

const Albums: FC<AlbumsPropTypes> = ({
	className,
	albums = [],
	orderBy = false,
	hideModal = false,
	alwaysList = false,
	hideInLibrary = false,
}) => {
	const listStyle = useStateListStyle()
	const isList = alwaysList ? true : (listStyle === SettingsListStyle.LIST)
	const empty = isEmpty(albums)
	return (
		<div className={bem(className, isList && !empty && "Elevated")}>
			{orderBy && (
				<SelectOrderBy
					orderBy={{
						key: "albums",
						fields: Object.keys(AlbumsOrderByField),
					}}
					className={bem(
						"FlexRowRight",
						isList && !empty && "ItemBorder",
						isList ? "PaddingHalf" : "MarginBottom",
					)}
				/>
			)}
			<List alwaysList={alwaysList}>
				{albums.map(
					album => (
						<Album
							album={album}
							key={album.albumID}
							hideModal={hideModal}
							alwaysList={alwaysList}
							hideInLibrary={hideInLibrary}
						/>
					),
				)}
			</List>
		</div>
	)
}

export interface AlbumsPropTypes extends ClassNameBEMPropTypes {
	orderBy?: boolean,
	hideModal?: boolean,
	albums?: AlbumType[],
	alwaysList?: boolean,
	hideInLibrary?: boolean,
}

export default Albums