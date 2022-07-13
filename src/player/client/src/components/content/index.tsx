import { BEMInput, createBEM } from "@oly_op/bem"
import { createElement, FC, PropsWithChildren } from "react"

const bem =
	createBEM("")

const Content: FC<PropsWithChildren<PropTypes>> = ({ children, className }) => (
	<div className={bem(className, "Content PaddingTopBottom")}>
		{children}
	</div>
)

interface PropTypes {
	className?: BEMInput,
}

export default Content