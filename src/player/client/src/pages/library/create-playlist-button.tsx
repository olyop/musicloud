import { PlaylistPrivacy } from "@oly_op/musicloud-common/build/types";
import Button from "@oly_op/react-button";
import isEmpty from "lodash-es/isEmpty";
import { FC, Fragment, createElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Input, { InputOnChange } from "../../components/input";
import Modal from "../../components/modal";
import Select, { SelectOnChange } from "../../components/select";
import { createObjectPath } from "../../helpers";
import { useCreatePlaylist } from "../../hooks";

const CreatePlaylistButton: FC<PropTypes> = ({ hideButtonText }) => {
	const navigate = useNavigate();

	const [isModalOpen, setIsModalOpen] = useState(false);

	const [title, setTitle] = useState("");
	const [privacy, setPrivacy] = useState(PlaylistPrivacy.PUBLIC);

	const [createPlaylist, { data }] = useCreatePlaylist();

	const handleTitleChange: InputOnChange = value => setTitle(value);

	const handleSetPrivacyChange: SelectOnChange = (value: string) =>
		setPrivacy(value as PlaylistPrivacy);

	const handleModalOpen = () => setIsModalOpen(true);

	const handleModalClose = () => setIsModalOpen(false);

	const handleSubmit = () => {
		if (!isEmpty(title)) {
			void createPlaylist({ title, privacy });
		}
	};

	useEffect(() => {
		if (data) {
			setTitle("");
			navigate(createObjectPath("playlist", data.createPlaylist.playlistID));
			handleModalClose();
		}
	}, [data]);

	return (
		<Fragment>
			<Button
				icon="playlist_add"
				title="Create Playlist"
				onClick={handleModalOpen}
				text={hideButtonText ? undefined : "Playlist"}
			/>
			<Modal
				open={isModalOpen}
				className="Padding"
				onClose={handleModalClose}
				children={
					<Fragment>
						<h1 className="HeadingFive MarginBottom">Create Playlist</h1>
						<Input
							name="Title"
							tabIndex={1}
							value={title}
							placeholder="Title"
							onChange={handleTitleChange}
							inputID="addToPlaylistTitle"
							className="MarginBottomThreeQuart"
						/>
						<div className="MarginBottom FlexColumnGapFifth">
							<p className="ParagraphTwoBold MarginBottomQuart">Privacy:</p>
							<Select
								tabIndex={2}
								value={privacy}
								onChange={handleSetPrivacyChange}
								className="ParagraphTwo MarginRightQuart"
								options={Object.keys(PlaylistPrivacy)}
							/>
						</div>
						<div className="FlexRowGapHalf">
							<Button icon="add" tabIndex={3} text="Create" onClick={handleSubmit} />
							<Button
								transparent
								icon="close"
								text="Close"
								tabIndex={4}
								onClick={handleModalClose}
							/>
						</div>
					</Fragment>
				}
			/>
		</Fragment>
	);
};

interface PropTypes {
	hideButtonText: boolean;
}

export default CreatePlaylistButton;
