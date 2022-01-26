import { isEmpty } from "lodash-es"
import Button from "@oly_op/react-button"
import { useState, createElement, VFC, Fragment } from "react"
import { PlaylistPrivacy } from "@oly_op/music-app-common/types"

import { Handler } from "../../types"
import Select from "../../components/select"
import { useCreatePlaylist } from "../../hooks"
import TextField, { TextFieldOnChange } from "../../components/text-field"

const LibraryCreatePlaylist: VFC<PropTypes> = ({ onClose }) => {
	const [ title, setTitle ] = useState("")
	const [ privacy, setPrivacy ] = useState(PlaylistPrivacy.PUBLIC)

	const [ createPlaylist ] =
		useCreatePlaylist()

	const handleTitleChange: TextFieldOnChange =
		value => setTitle(value)

	const handleSetPrivacyChange =
		(value: string) =>
			setPrivacy(value as PlaylistPrivacy)

	const handleSubmit =
		async () => {
			if (!isEmpty(title)) {
				setTitle("")
				await onClose()
				await createPlaylist({ title, privacy })
			}
		}

	return (
		<Fragment>
			<h1 className="HeadingFive MarginBottom">
				Create Playlist
			</h1>
			<TextField
				name="Title"
				value={title}
				placeholder="Title"
				onChange={handleTitleChange}
				fieldID="addToPlaylistTitle"
				className="MarginBottomThreeQuart"
			/>
			<div className="MarginBottom FlexColumnGapFifth">
				<p className="BodyTwoBold MarginBottomQuart">
					Privacy:
				</p>
				<Select
					value={privacy}
					onChange={handleSetPrivacyChange}
					className="BodyTwo MarginRightQuart"
					options={Object.keys(PlaylistPrivacy)}
				/>
			</div>
			<div className="FlexRowGapHalf">
				<Button
					icon="add"
					text="Create"
					onClick={handleSubmit}
				/>
				<Button
					transparent
					icon="close"
					text="Close"
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