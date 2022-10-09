import isEmpty from "lodash-es/isEmpty";
import { createBEM } from "@oly_op/bem";
import { useState, createElement, FC, Fragment, useEffect } from "react";
import { PlaylistID, AlbumID } from "@oly_op/musicloud-common/build/types";

import Playlist from "../playlist";
import Playlists from "../playlists";
import { useQuery, useMutation } from "../../hooks";
import { ModalButton, ModalButtons } from "../modal";
import { User, Playlist as PlaylistType, Handler } from "../../types";

import GET_USER_PLAYLISTS from "./get-user-playlists.gql";
import ADD_ALBUM_TO_PLAYLIST from "./add-album-to-playlist.gql";

import "./index.scss";

const bem = createBEM("AddAlbumToPlaylist");

const AddAlbumToPlaylist: FC<PropTypes> = ({ albumID, onClose }) => {
	const [playlistID, setPlaylistID] = useState<string | null>(null);

	const { data: playlistsData } = useQuery<GetUserPlaylistsData, AlbumID>(GET_USER_PLAYLISTS, {
		variables: { albumID },
		fetchPolicy: "cache-and-network",
	});

	const [add, { data: mutationData }] = useMutation<AddToPlaylistData, AddToPlaylistVars>(
		ADD_ALBUM_TO_PLAYLIST,
	);

	const handleAdd = () => {
		if (playlistID) {
			void add({
				variables: { albumID, playlistID },
			});
		}
	};

	const handlePlaylistSelect = (value: string) => () =>
		setPlaylistID(value === playlistID ? null : value);

	useEffect(() => {
		if (mutationData) {
			onClose();
			setPlaylistID(null);
		}
	}, [mutationData]);

	return (
		<Fragment>
			{playlistsData ? (
				<Fragment>
					{isEmpty(playlistsData.getUser.playlists) ? (
						<p className="ParagraphOne Center PaddingTopBottom">No playlists to add to.</p>
					) : (
						<Playlists hideElevated>
							{playlistsData.getUser.playlists.map(playlist => (
								<Playlist
									hidePlay
									hidePlays
									hideModal
									hideInLibrary
									playlist={playlist}
									key={playlist.playlistID}
									onClick={handlePlaylistSelect(playlist.playlistID)}
									className={bem("playlist", playlist.playlistID === playlistID && "selected")}
								/>
							))}
						</Playlists>
					)}
					<ModalButtons className="BorderTop">
						{isEmpty(playlistsData.getUser.playlists) || (
							<ModalButton icon="add" text="Add To Playlist" onClick={handleAdd} />
						)}
						<ModalButton text="Cancel" icon="arrow_back" onClick={onClose} />
					</ModalButtons>
				</Fragment>
			) : (
				<p className="ParagraphOne Center PaddingTopBottom">Loading...</p>
			)}
		</Fragment>
	);
};

interface GetUserPlaylistsData {
	getUser: User;
}

interface AddToPlaylistVars extends AlbumID, PlaylistID {}

interface AddToPlaylistData {
	addAlbumToPlaylist: PlaylistType;
}

interface PropTypes extends AlbumID {
	onClose: Handler;
}

export default AddAlbumToPlaylist;
