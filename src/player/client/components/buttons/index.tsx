import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"

import { ClassNameBEMPropTypes } from "../../types"

import "./index.scss"

const bem =
	createBEM("Buttons")

const Buttons: FC<ClassNameBEMPropTypes> = ({ className, children }) => (
	<div className={bem(className, "")}>
		{children}
	</div>
)

export default Buttons