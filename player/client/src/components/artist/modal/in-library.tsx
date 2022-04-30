import { createElement, FC } from "react"

import { ModalButton } from "../../modal"
import { Handler, Artist } from "../../../types"
import { useToggleObjectInLibrary } from "../../../hooks"

const InLibraryButton: FC<PropTypes> = ({ artist, onClose }) => {
	const [ toggleInLibrary, inLibrary ] = useToggleObjectInLibrary(artist)
	return (
		<ModalButton
			onClose={onClose}
			onClick={toggleInLibrary}
			icon={inLibrary ? "done" : "add"}
			text={inLibrary ? "Remove" : "Add"}
		/>
	)
}

interface PropTypes {
	artist: Artist,
	onClose: Handler,
}

export default InLibraryButton