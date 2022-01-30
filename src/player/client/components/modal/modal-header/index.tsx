import { createBEM } from "@oly_op/bem"
import { createElement, ReactNode, VFC } from "react"

import "./index.scss"

const bem =
	createBEM("ModalHeader")

const ModalHeader: VFC<ModalHeaderPropTypes> = ({ text, image }) => (
	<div className="ItemBorder FlexRowGapHalfCenter PaddingHalf">
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
	</div>
)

interface ModalHeaderImageOptions {
	src: string,
	description: string,
}

export interface ModalHeaderPropTypes {
	text?: ReactNode,
	image?: ModalHeaderImageOptions,
}

export default ModalHeader