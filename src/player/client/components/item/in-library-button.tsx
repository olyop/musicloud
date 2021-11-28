import Button from "@oly_op/react-button"
import { createElement, VFC } from "react"

import { OnClickPropTypes } from "../../types"

const InLibraryButton: VFC<PropTypes> = ({ inLibrary, onClick, className }) => (
	<Button
		transparent
		onClick={onClick}
		className={className}
		icon={inLibrary ? "done" : "add"}
		title={`${inLibrary ? "Remove from" : "Add to"} Library`}
	/>
)

interface PropTypes extends OnClickPropTypes {
	inLibrary: boolean,
	className?: string,
}

export default InLibraryButton