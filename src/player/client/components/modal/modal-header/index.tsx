import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button/build"
import { createElement, ReactNode, VFC } from "react"

import "./index.scss"

const bem =
	createBEM("ModalHeader")

const ModalHeader: VFC<ModalHeaderPropTypes> = ({
	text,
	icon,
	image,
	hideShareButton = false,
}) => (
	<div className={bem("", "FlexRowGapHalfCenter ItemBorder PaddingLeftRightHalf")}>
		{icon && (
			<Button
				transparent
				icon={icon}
				className={bem("icon-left", "icon")}
			/>
		)}
		{image && (
			<img
				src={image.src}
				alt={image.description}
				crossOrigin="anonymous"
				className={bem("img", "Rounded")}
			/>
		)}
		<p className={bem("text", "BodyOne")}>
			{text}
		</p>
		{hideShareButton || (
			<Button
				transparent
				icon="share"
				title="Share"
				className={bem("icon-share", "icon")}
			/>
		)}
	</div>
)

interface ImageOptions {
	src: string,
	description: string,
}

export interface ModalHeaderPropTypes {
	icon?: string,
	text?: ReactNode,
	image?: ImageOptions,
	hideShareButton?: boolean,
}

export default ModalHeader