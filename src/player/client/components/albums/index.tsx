import isEmpty from "lodash/isEmpty"
import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"

import List from "../list"
import Album from "../album"
import SelectOrderBy from "../select-order-by"
import { useStateListStyle } from "../../redux"
import { SettingsListStyle, Album as AlbumType } from "../../types"

const bem =
	createBEM("Albums")

const Albums: FC<PropTypes> = ({
	className,
	albums = [],
	orderByFields,
	hideModal = false,
	alwaysList = false,
	hideOrderBy = false,
}) => {
	const listStyle = useStateListStyle()
	const isList = alwaysList ? true : (listStyle === SettingsListStyle.LIST)
	const empty = isEmpty(albums)
	return (
		<div className={bem(className, isList && !empty && "Elevated")}>
			{hideOrderBy || (
				<SelectOrderBy
					settingsKey="albums"
					fieldOptions={orderByFields!}
					className={bem(
						"FlexListRight",
						isList && !empty && "ItemBorder",
						isList ? "PaddingHalf" : "MarginBottomHalf",
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
						/>
					),
				)}
			</List>
		</div>
	)
}

interface PropTypes {
	className?: string,
	hideModal?: boolean,
	albums?: AlbumType[],
	alwaysList?: boolean,
	hideOrderBy?: boolean,
	orderByFields?: string[],
}

export default Albums