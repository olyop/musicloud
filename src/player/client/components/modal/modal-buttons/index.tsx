import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"

import "./index.scss"

const bem =
	createBEM("ModalButtons")

const ModalButtons: FC = ({ children }) => (
	<div className={bem("")}>
		{children}
	</div>
)

export default ModalButtons