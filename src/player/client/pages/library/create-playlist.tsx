import isEmpty from "lodash/isEmpty"
import Button from "@oly_op/react-button"
import { useState, createElement, VFC, Fragment } from "react"

import { Handler } from "../../types"
import { useCreatePlaylist } from "../../hooks"
import TextField, { TextFieldOnChange } from "../../components/text-field"

const LibraryCreatePlaylist: VFC<PropTypes> = ({ onClose }) => {
	const [ title, setTitle ] = useState("")
	const [ isPublic, setIsPublic ] = useState(false)

	const [ createPlaylist ] =
		useCreatePlaylist()

	const handleTitleChange: TextFieldOnChange =
		(value: string) =>
			setTitle(value)

	const handleIsPublicChange =
		() => setIsPublic(prevState => !prevState)

	const handleSubmit =
		async () => {
			if (!isEmpty(title)) {
				setTitle("")
				await onClose()
				await createPlaylist({ title, isPublic })
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
				className="MarginBottomHalf"
				onChange={handleTitleChange}
				fieldID="addToPlaylistTitle"
			/>
			<div className="MarginBottom FlexListGapFifth">
				<input
					type="checkbox"
					checked={isPublic}
					className="BodyOne"
					onChange={handleIsPublicChange}
				/>
				<p className="BodyOne LightWeight">
					Public
				</p>
			</div>
			<div className="FlexListGapHalf">
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