import Button from "@oly_op/react-button"
import { createElement, Fragment, useState, VFC } from "react"

import { Playlist } from "../../types"
import Modal from "../../components/modal"
import { useUpdatePlaylistTitle } from "../../hooks"
import Input, { InputOnChange } from "../../components/input"

const PlaylistPageRenameButton: VFC<PropTypes> = ({ playlist }) => {
	const { playlistID } = playlist
	const [ modal, setModal ] = useState(false)
	const [ title, setTitle ] = useState(playlist.title)

	const [ updatePlaylistTitle ] =
		useUpdatePlaylistTitle({ playlistID })

	const handleModalOpen =
		() => setModal(true)

	const handleModalClose =
		() => setModal(false)

	const handleChange: InputOnChange =
		value => setTitle(value)

	const handleSubmit =
		async () => {
			handleModalClose()
			await updatePlaylistTitle({ title })
		}

	return (
		<Fragment>
			<Button
				icon="edit"
				text="Rename"
				onClick={handleModalOpen}
			/>
			<Modal open={modal} onClose={handleModalClose} className="Padding">
				{onClose => (
					<Fragment>
						<h1 className="HeadingFive MarginBottom">
							Rename
						</h1>
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
							<Button
								icon="edit"
								tabIndex={2}
								text="Rename"
								onClick={handleSubmit}
							/>
							<Button
								transparent
								icon="close"
								text="Close"
								tabIndex={3}
								onClick={onClose}
							/>
						</div>
					</Fragment>
				)}
			</Modal>
		</Fragment>
	)
}

interface PropTypes {
	playlist: Playlist,
}

export default PlaylistPageRenameButton