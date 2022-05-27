import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"

import {
	ObjectShowIcon,
	OnClickPropTypes,
	ClassNameBEMPropTypes,
	Playlist as PlaylistType,
} from "../../types"

import Item from "../item"
import Modal from "./modal"
import ObjectLink from "../object-link"
import { usePlayPlaylist } from "../../hooks"
import { createObjectPath } from "../../helpers"

const bem =
	createBEM("Playlist")

const Playlist: FC<PropTypes> = ({
	onClick,
	playlist,
	className,
	showIcon = false,
	hideModal = false,
	hideInLibrary = false,
}) => {
	const { playlistID } = playlist

	const [ playPlaylist, isPlaying ] =
		usePlayPlaylist({ playlistID })

	return (
		<Item
			onClick={onClick}
			leftIcon={showIcon ? "queue_music" : undefined}
			className={bem(className, "ItemBorder PaddingHalf")}
			infoOptions={{
				upperLeft: onClick ? playlist.title : (
					<ObjectLink
						link={{
							text: playlist.title,
							path: createObjectPath("playlist", playlist.playlistID),
						}}
					/>
				),
				lowerLeft: (
					<ObjectLink
						link={{
							text: playlist.user.name,
							path: createObjectPath("user", playlist.user.userID),
						}}
					/>
				),
			}}
			playOptions={{
				isPlaying,
				onClick: playPlaylist,
			}}
			modal={hideModal ? undefined : ({ open, onClose }) => (
				<Modal
					open={open}
					onClose={onClose}
					playlist={playlist}
					hideInLibrary={hideInLibrary}
				/>
			)}
		/>
	)
}

interface PropTypes
	extends
	ObjectShowIcon,
	OnClickPropTypes,
	ClassNameBEMPropTypes {
	hideModal?: boolean,
	playlist: PlaylistType,
	hideInLibrary?: boolean,
}

export default Playlist