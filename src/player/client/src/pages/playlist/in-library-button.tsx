import Button from "@oly_op/react-button"
import { createElement, FC } from "react"

import { Playlist } from "../../types"
import { useToggleObjectInLibrary } from "../../hooks"

const PlaylistPageInLibraryButton: FC<PropTypes> = ({ playlist }) => {
	const [ toggleInLibrary, inLibrary ] = useToggleObjectInLibrary(playlist)
	return (
		<Button
			onClick={toggleInLibrary}
			icon={inLibrary ? "done" : "add"}
			text={inLibrary ? "Remove" : "Add"}
		/>
	)
}

interface PropTypes {
	playlist: Playlist,
}

export default PlaylistPageInLibraryButton