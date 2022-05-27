import { createElement, FC } from "react"
import { BEMInput, createBEM } from "@oly_op/bem"
import { ChildrenProps } from "@oly_op/musicloud-common"

const bem =
	createBEM("")

const Content: FC<PropTypes> = ({ children, className }) => (
	<div className={bem(className, "Content PaddingTopBottom")}>
		{children}
	</div>
)

interface PropTypes extends ChildrenProps {
	className?: BEMInput,
}

export default Content