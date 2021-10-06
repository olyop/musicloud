import isEmpty from "lodash/isEmpty"
import { createElement, FC } from "react"
import isFunction from "lodash/isFunction"
import { createBEM, BEMInput } from "@oly_op/bem"

import Playlist from "../playlist"
import SelectOrderBy from "../select-order-by"
import { SettingsOrderBy, Playlist as TPlaylist } from "../../types"

const bem =
	createBEM("Playlists")

const Playlists: FC<PropTypes> = ({
	className,
	orderByKey,
	isSelected,
	orderByFields,
	playlists = [],
	onPlaylistClick,
	hideModal = false,
	playlistClassName,
	selectedClassName,
	hideOrderBy = false,
	hideInLibrary = false,
}) => (
	<div className={bem(className, isEmpty(playlists) || "Elevated")}>
		{hideOrderBy || (
			<SelectOrderBy
				settingsKey={orderByKey!}
				fieldOptions={orderByFields!}
				className="PaddingHalf ItemBorder FlexListRight"
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
						(isFunction(isSelected) ? isSelected(playlist.playlistID) : isSelected) && selectedClassName,
						playlistClassName,
						"ItemBorder PaddingHalf",
					)}
				/>
			),
		)}
	</div>
)

interface PropTypes {
	className?: string,
	hideModal?: boolean,
	hideOrderBy?: boolean,
	playlists?: TPlaylist[],
	hideInLibrary?: boolean,
	orderByFields?: string[],
	playlistClassName?: BEMInput,
	selectedClassName?: BEMInput,
	onPlaylistClick?: (playlistID: string) => void,
	isSelected?: boolean | ((playlistID: string) => boolean),
	orderByKey?: keyof Pick<SettingsOrderBy, "playlists" | "libraryPlaylists">,
}

export default Playlists