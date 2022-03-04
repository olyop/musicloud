import { Link } from "react-router-dom"
import { createBEM } from "@oly_op/bem"
import { createElement, VFC } from "react"

import { ClassNameBEMPropTypes, OnClickPropTypes } from "../../types"

import "./index.scss"

const bem =
	createBEM("ObjectLink")

const ObjectLink: VFC<PropTypes> = ({
	link,
	onClick,
	className,
}) => (
	<Link
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

interface PropTypes
	extends
	OnClickPropTypes,
	ClassNameBEMPropTypes {
	link: ObjectLinkOptions,
}

export default ObjectLink