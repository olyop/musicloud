import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"
import { ChildrenProps } from "@oly_op/musicloud-common"

import { ClassNameBEMPropTypes } from "../../types"

import "./index.scss"

const bem =
	createBEM("Buttons")

const Buttons: FC<PropTypes> = ({ className, children }) => (
	<div className={bem(className, "")}>
		{children}
	</div>
)

interface PropTypes
	extends ChildrenProps, ClassNameBEMPropTypes {}

export default Buttons