import { createElement, FC } from "react"
import { isEmpty, isFunction } from "lodash-es"
import { createBEM, BEMInput } from "@oly_op/bem"

import {
	OrderByOptions,
	SettingsOrderByPlaylists,
	Playlist as PlaylistType,
} from "../../types"

import Playlist from "../playlist"
import SelectOrderBy from "../select-order-by"

const bem =
	createBEM("Playlists")

const Playlists: FC<PlaylistsPropTypes> = ({
	className,
	playlists,
	isSelected,
	orderBy = false,
	onPlaylistClick,
	hideModal = false,
	playlistClassName,
	selectedClassName,
	hideInLibrary = false,
}) => (
	<div className={bem(className, isEmpty(playlists) || "Elevated")}>
		{orderBy && (
			<SelectOrderBy
				alwaysList
				orderBy={orderBy}
				className="PaddingHalf ItemBorder FlexRowRight"
			/>
		)}
		{playlists.map(
			playlist => (
				<Playlist
					playlist={playlist}
					hideModal={hideModal}
					key={playlist.playlistID}
					hideInLibrary={hideInLibrary}
					onClick={onPlaylistClick ? () => {
						onPlaylistClick(playlist.playlistID)
					} : undefined}
					className={bem(
						(isFunction(isSelected) ?
							isSelected(playlist.playlistID) : isSelected) && selectedClassName,
						playlistClassName,
						"ItemBorder PaddingHalf",
					)}
				/>
			),
		)}
	</div>
)

export interface PlaylistsPropTypes {
	className?: string,
	hideModal?: boolean,
	hideInLibrary?: boolean,
	playlists: PlaylistType[],
	playlistClassName?: BEMInput,
	selectedClassName?: BEMInput,
	onPlaylistClick?: (playlistID: string) => void,
	isSelected?: boolean | ((playlistID: string) => boolean),
	orderBy?: OrderByOptions<SettingsOrderByPlaylists> | false,
}

export default Playlists