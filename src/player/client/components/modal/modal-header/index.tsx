import { createBEM } from "@oly_op/bem"
import { createElement, ReactNode, VFC } from "react"
import Image, { ImagePropTypes } from "@oly_op/react-image"

import "./index.scss"

const bem =
	createBEM("ModalHeader")

const ModalHeader: VFC<ModalHeaderPropTypes> = ({ text, imgPropTypes }) => (
	<div className="ItemBorder FlexRowGapHalfCenter PaddingHalf">
		{imgPropTypes && (
			<Image
				className={bem("img", "Rounded")}
				{...imgPropTypes}
			/>
		)}
		<p className={bem("text", "BodyOne")}>
			{text}
		</p>
	</div>
)

export interface ModalHeaderPropTypes {
	text?: ReactNode,
	imgPropTypes?: ImagePropTypes,
}

export default ModalHeader