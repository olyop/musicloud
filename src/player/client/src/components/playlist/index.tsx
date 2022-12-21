import { createBEM } from "@oly_op/bem";
import isNull from "lodash-es/isNull";
import { createElement, forwardRef } from "react";

import { createObjectPath, formatPlays } from "../../helpers";
import { usePlayPlaylist } from "../../hooks";
import {
	ClassNameBEMPropTypes,
	ObjectShowIcon,
	OnClickPropTypes,
	Playlist as PlaylistType,
} from "../../types";
import Item from "../item";
import ObjectLink from "../object-link";
import Modal from "./modal";

const bem = createBEM("Playlist");

const Playlist = forwardRef<HTMLDivElement, PropTypes>((propTypes, ref) => {
	const {
		onClick,
		playlist,
		showIcon = false,
		hidePlay = false,
		hidePlays = false,
		hideModal = false,
		hideInLibrary = false,
		className = "ItemBorder PaddingHalf",
	} = propTypes;

	const isPlaylistNull = isNull(playlist);

	const [playPlaylist, isPlaying] = usePlayPlaylist(playlist);

	return (
		<Item
			ref={ref}
			onClick={onClick}
			leftIcon={showIcon ? "queue_music" : undefined}
			className={bem(className, "ItemBorder PaddingHalf")}
			infoOptions={
				isPlaylistNull
					? undefined
					: {
							upperLeft: onClick ? (
								playlist.title
							) : (
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
							rightLeft:
								hidePlays || isNull(playlist.playsTotal) ? null : formatPlays(playlist.playsTotal),
					  }
			}
			playOptions={
				hidePlay || isPlaylistNull
					? undefined
					: {
							isPlaying,
							onClick: playPlaylist,
					  }
			}
			modal={
				isPlaylistNull || hideModal
					? undefined
					: ({ open, onClose }) => (
							<Modal
								open={open}
								onClose={onClose}
								playlist={playlist}
								hideInLibrary={hideInLibrary}
							/>
					  )
			}
		/>
	);
});

interface PropTypes extends ObjectShowIcon, OnClickPropTypes, ClassNameBEMPropTypes {
	hidePlay?: boolean;
	hidePlays?: boolean;
	hideModal?: boolean;
	hideInLibrary?: boolean;
	playlist: PlaylistType | null;
}

export default Playlist;
