import { createElement, VFC } from "react"
import { isEmpty, isFunction } from "lodash-es"
import { createBEM, BEMInput } from "@oly_op/bem"

import Playlist from "../playlist"
import SelectOrderBy from "../select-order-by"
import { SettingsOrderByPlaylists, Playlist as TPlaylist, OrderByOptions } from "../../types"

const bem =
	createBEM("Playlists")

const Playlists: VFC<PlaylistsPropTypes> = ({
	className,
	isSelected,
	playlists = [],
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
	playlists?: TPlaylist[],
	hideInLibrary?: boolean,
	playlistClassName?: BEMInput,
	selectedClassName?: BEMInput,
	onPlaylistClick?: (playlistID: string) => void,
	isSelected?: boolean | ((playlistID: string) => boolean),
	orderBy?: OrderByOptions<SettingsOrderByPlaylists> | false,
}

export default Playlists