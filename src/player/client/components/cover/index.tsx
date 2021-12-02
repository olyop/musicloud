import Image from "@oly_op/react-image"
import { Link } from "react-router-dom"
import { createElement, FC } from "react"
import { createBEM, BEMInput } from "@oly_op/bem"

import { ClassNameBEMPropTypes, OnClickPropTypes } from "../../types"

import "./index.scss"

const bem =
	createBEM("Cover")

const Cover: FC<PropTypes> = ({
	url,
	link,
	title,
	onClick,
	children,
	className,
	imgClassName,
	landscape = false,
}) => (
	<Image
		url={url}
		title={title}
		onClick={onClick}
		imgClassName={bem(imgClassName, "img")}
		className={bem(landscape ? "landscape" : null, className, "")}
	>
		<Link
			to={link}
			className={bem("link")}
		/>
		{children}
	</Image>
)

interface PropTypes extends ClassNameBEMPropTypes, OnClickPropTypes {
	url: string,
	link: string,
	title: string,
	landscape?: boolean,
	imgClassName?: BEMInput,
}

export default Cover