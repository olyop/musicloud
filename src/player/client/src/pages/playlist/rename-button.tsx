import Button from "@oly_op/react-button";
import { FC, Fragment, createElement, useState } from "react";

import Input, { InputOnChange } from "../../components/input";
import Modal from "../../components/modal";
import { useUpdatePlaylistTitle } from "../../hooks";
import { Playlist } from "../../types";

const PlaylistPageRenameButton: FC<PropTypes> = ({ playlist }) => {
	const { playlistID } = playlist;
	const [modal, setModal] = useState(false);
	const [title, setTitle] = useState(playlist.title);

	const [updatePlaylistTitle] = useUpdatePlaylistTitle({ playlistID });

	const handleModalOpen = () => setModal(true);

	const handleModalClose = () => setModal(false);

	const handleChange: InputOnChange = value => setTitle(value);

	const handleSubmit = () => {
		handleModalClose();
		void updatePlaylistTitle({ title });
	};

	return (
		<Fragment>
			<Button icon="edit" text="Rename" onClick={handleModalOpen} />
			<Modal open={modal} onClose={handleModalClose} className="Padding">
				{onClose => (
					<Fragment>
						<h1 className="HeadingFive MarginBottom">Rename</h1>
						<Input
							name="Title"
							tabIndex={1}
							value={title}
							placeholder="Title"
							onChange={handleChange}
							className="MarginBottom"
							inputID="addToPlaylistTitle"
						/>
						<div className="FlexRowGapHalf">
							<Button icon="edit" tabIndex={2} text="Rename" onClick={handleSubmit} />
							<Button transparent icon="close" text="Close" tabIndex={3} onClick={onClose} />
						</div>
					</Fragment>
				)}
			</Modal>
		</Fragment>
	);
};

interface PropTypes {
	playlist: Pick<Playlist, "__typename" | "playlistID" | "title">;
}

export default PlaylistPageRenameButton;
