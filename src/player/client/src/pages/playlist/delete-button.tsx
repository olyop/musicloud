import { PlaylistID } from "@oly_op/musicloud-common/build/types";
import Button from "@oly_op/react-button";
import { FC, Fragment, createElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Modal, { ModalButton, ModalButtons, ModalHeader } from "../../components/modal";
import { useDeletePlaylist } from "../../hooks";

const PlaylistPageDeleteButton: FC<PlaylistID> = ({ playlistID }) => {
	const navigate = useNavigate();
	const [modal, setModal] = useState(false);

	const [deletePlaylist, { data }] = useDeletePlaylist({ playlistID });

	const handleModalOpen = () => setModal(true);

	const handleModalClose = () => setModal(false);

	useEffect(() => {
		if (data?.deletePlaylistByID === null) {
			navigate(-2);
		}
	}, [data]);

	return (
		<Fragment>
			<Button icon="delete" text="Delete" onClick={handleModalOpen} />
			<Modal open={modal} onClose={handleModalClose}>
				<ModalHeader
					hideShare
					text={
						<Fragment>
							<Fragment>Are you sure you want</Fragment>
							<br />
							<Fragment>to delete this playlist?</Fragment>
						</Fragment>
					}
				/>
				<ModalButtons>
					<ModalButton
						text="Delete"
						icon="delete"
						onClick={deletePlaylist}
						onClose={handleModalClose}
					/>
					<ModalButton text="Cancel" icon="arrow_back" onClick={handleModalClose} />
				</ModalButtons>
			</Modal>
		</Fragment>
	);
};

export default PlaylistPageDeleteButton;
