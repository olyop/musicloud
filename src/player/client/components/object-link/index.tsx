import { createBEM } from "@oly_op/bem"
import { createElement, VFC } from "react"
import { NavLink } from "react-router-dom"

import { ClassNameBEMPropTypes, OnClickPropTypes } from "../../types"

import "./index.scss"

const bem =
	createBEM("ObjectLink")

const ObjectLink: VFC<PropTypes> = ({
	link,
	onClick,
	className,
}) => (
	<NavLink
		to={link.path}
		title={link.text}
		onClick={onClick}
		children={link.text}
		className={bem(className, "")}
	/>
)

export interface ObjectLinkOptions {
	path: string,
	text: string,
}

interface PropTypes extends ClassNameBEMPropTypes, OnClickPropTypes {
	link: ObjectLinkOptions,
}

export default ObjectLink