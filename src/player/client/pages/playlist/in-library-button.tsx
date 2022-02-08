import Button from "@oly_op/react-button"
import { createElement, VFC } from "react"

import { Playlist } from "../../types"
import { useToggleObjectInLibrary } from "../../hooks"

const PlaylistPageInLibraryButton: VFC<PropTypes> = ({ playlist }) => {
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