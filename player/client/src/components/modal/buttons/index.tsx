import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"
import { ChildrenProps } from "@oly_op/musicloud-common"
import "./index.scss"

const bem =
	createBEM("ModalButtons")

const Buttons: FC<ChildrenProps> = ({ children }) => (
	<div className={bem("")}>
		{children}
	</div>
)

export default Buttons