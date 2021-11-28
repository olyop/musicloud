import isEmpty from "lodash/isEmpty"
import Button from "@oly_op/react-button"
import { useState, createElement, VFC, Fragment } from "react"

import { Handler } from "../../types"
import { useCreatePlaylist } from "../../hooks"
import TextField from "../../components/text-field"

const LibraryCreatePlaylist: VFC<PropTypes> = ({ onClose }) => {
	const [ title, setTitle ] =
		useState("")

	const [ createPlaylist ] =
		useCreatePlaylist()

	const handleInput =
		(value: string) =>
			setTitle(value)

	const handleSubmit =
		async () => {
			if (!isEmpty(title)) {
				setTitle("")
				await onClose()
				await createPlaylist({ title })
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
				onChange={handleInput}
				className="MarginBottom"
				fieldID="addToPlaylistTitle"
			/>
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