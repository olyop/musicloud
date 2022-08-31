import isEmpty from "lodash-es/isEmpty"
import Button from "@oly_op/react-button"
import { useNavigate } from "react-router-dom"
import { useState, createElement, FC, Fragment, useEffect } from "react"
import { PlaylistPrivacy } from "@oly_op/musicloud-common/build/types"

import { Handler } from "../../types"
import { useCreatePlaylist } from "../../hooks"
import Input, { InputOnChange } from "../../components/input"
import Select, { SelectOnChange } from "../../components/select"
import { createObjectPath } from "../../helpers"

const LibraryCreatePlaylist: FC<PropTypes> = ({ onClose }) => {
	const navigate = useNavigate()
	const [ title, setTitle ] = useState("")
	const [ privacy, setPrivacy ] = useState(PlaylistPrivacy.PUBLIC)

	const [ createPlaylist, { data } ] =
		useCreatePlaylist()

	const handleTitleChange: InputOnChange =
		value => setTitle(value)

	const handleSetPrivacyChange: SelectOnChange =
		(value: string) => setPrivacy(value as PlaylistPrivacy)

	const handleSubmit =
		() => {
			if (!isEmpty(title)) {
				void createPlaylist({ title, privacy })
			}
		}

	useEffect(() => {
		if (data) {
			setTitle("")
			navigate(createObjectPath("playlist", data.createPlaylist.playlistID))
			onClose()
		}
	}, [data])

	return (
		<Fragment>
			<h1 className="HeadingFive MarginBottom">
				Create Playlist
			</h1>
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
				<p className="ParagraphTwoBold MarginBottomQuart">
					Privacy:
				</p>
				<Select
					tabIndex={2}
					value={privacy}
					onChange={handleSetPrivacyChange}
					className="ParagraphTwo MarginRightQuart"
					options={Object.keys(PlaylistPrivacy)}
				/>
			</div>
			<div className="FlexRowGapHalf">
				<Button
					icon="add"
					tabIndex={3}
					text="Create"
					onClick={handleSubmit}
				/>
				<Button
					transparent
					icon="close"
					text="Close"
					tabIndex={4}
					onClick={onClose}
				/>
			</div>
		</Fragment>
	)
}

interface PropTypes {
	onClose: Handler,
}

export default LibraryCreatePlaylist