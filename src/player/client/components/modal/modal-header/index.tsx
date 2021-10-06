import { createBEM } from "@oly_op/bem"
import { createElement, FC, ReactNode } from "react"
import Image, { ImagePropTypes } from "@oly_op/react-image"

import "./index.scss"

const bem =
	createBEM("ModalHeader")

const ModalHeader: FC<ModalHeaderPropTypes> = ({ text, imgPropTypes }) => (
	<div className="ItemBorder FlexListGapHalfCenter PaddingHalf">
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