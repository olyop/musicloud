import { createElement, FC } from "react"
import { NavLink } from "react-router-dom"
import { createBEM, BEMPropTypes } from "@oly_op/bem"

import { OnClickPropTypes } from "../../types"

import "./index.scss"

const bem =
	createBEM("ObjectLink")

const ObjectLink: FC<PropTypes> = ({
	path,
	text,
	onClick,
	className,
}) => (
	<NavLink
		to={path}
		title={text}
		children={text}
		onClick={onClick}
		className={bem(className, "")}
	/>
)

export interface ObjectLinkOptions {
	path: string,
	text: string,
}

interface PropTypes
	extends BEMPropTypes, OnClickPropTypes, ObjectLinkOptions {}

export default ObjectLink