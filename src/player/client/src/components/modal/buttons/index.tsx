import { createBEM } from "@oly_op/bem"
import { createElement, FC, PropsWithChildren } from "react"

import "./index.scss"

const bem =
	createBEM("ModalButtons")

const Buttons: FC<PropsWithChildren> = ({ children }) => (
	<div className={bem("")}>
		{children}
	</div>
)

export default Buttons