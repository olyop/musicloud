import isEmpty from "lodash/isEmpty"
import Button from "@oly_op/react-button"
import { useState, createElement, FC, Fragment } from "react"
import { InterfaceWithInput } from "@oly_op/music-app-common/types"

import { getUserID } from "../../helpers"
import { useMutation } from "../../hooks"
import { Handler, Playlist } from "../../types"
import TextField from "../../components/text-field"
import CREATE_PLAYLIST from "./create-playlist.gql"

const LibraryCreatePlaylist: FC<PropTypes> = ({ onClose }) => {
	const userID = getUserID()
	const [ title, setTitle ] = useState("")

	const [ addPlaylist ] =
		useMutation<Data, Vars>(CREATE_PLAYLIST)

	const handleInput =
		(value: string) =>
			setTitle(value)

	const handleSubmit =
		async () => {
			if (!isEmpty(title)) {
				try {
					await addPlaylist({
						variables: { input: { title } },
						update: (cache, { data }) => {
							cache.modify({
								id: cache.identify({ userID, __typename: "User" }),
								fields: {
									libraryPlaylists: (existing: Playlist[]) => [
										...existing,
										data?.createPlaylist,
									],
								},
							})
						},
					})
				} finally {
					onClose()
				}
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

interface Data {
	createPlaylist: Playlist,
}

type Vars =
	InterfaceWithInput<Pick<Playlist, "title">>

export default LibraryCreatePlaylist