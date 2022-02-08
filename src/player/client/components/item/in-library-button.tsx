import Button from "@oly_op/react-button"
import { createElement, HTMLAttributes, VFC } from "react"

import { OnClickPropTypes } from "../../types"

const determineIcon =
	({ isError, inLibrary }: PropTypesBase) => {
		if (isError) {
			return "warning"
		} else {
			if (inLibrary) {
				return "done"
			} else {
				return "add"
			}
		}
	}

const InLibraryButton: VFC<PropTypes> = ({
	isError,
	onClick,
	className,
	inLibrary,
}) => (
	<Button
		transparent
		onClick={onClick}
		className={className}
		icon={determineIcon({ isError, inLibrary })}
		title={`${inLibrary ? "Remove from" : "Add to"} Library`}
	/>
)

interface PropTypesBase {
	isError?: boolean,
	inLibrary: boolean,
}

interface PropTypes
	extends
	PropTypesBase,
	OnClickPropTypes,
	Pick<HTMLAttributes<HTMLButtonElement>, "className"> {}

export default InLibraryButton