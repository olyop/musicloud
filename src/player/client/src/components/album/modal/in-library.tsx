import { createElement, FC } from "react"
import { AlbumID } from "@oly_op/musicloud-common/build/types"

import { ModalButton, ModalOnClose } from "../../modal"
import { useToggleAlbumInLibrary } from "../../../hooks"

const InLibraryButton: FC<PropTypes> = ({ albumID, onClose }) => {
	const [ toggleInLibrary, inLibrary ] = useToggleAlbumInLibrary({ albumID })
	return (
		<ModalButton
			onClose={onClose}
			onClick={toggleInLibrary}
			icon={inLibrary ? "done" : "add"}
			text={inLibrary ? "Remove" : "Add"}
		/>
	)
}

interface PropTypes
	extends AlbumID, ModalOnClose {}

export default InLibraryButton