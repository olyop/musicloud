import { createElement, FC } from "react"
import { createBEM, BEMInput, BEMPropTypes } from "@oly_op/bem"

import { Handler } from "../../types"
import ModalButtons from "./modal-buttons"
import ModalHeader, { ModalHeaderPropTypes } from "./modal-header"
import ModalButton, { ModalButtonPropTypes } from "./modal-button"

import "./index.scss"

const bem =
	createBEM("Modal")

const Modal: FC<ModalPropTypes> = ({
	onClose,
	children,
	className,
	contentClassName,
	backgroundClassName,
}) => (
	<div className={bem("")}>
		<div
			onClick={onClose}
			className={bem(backgroundClassName, "background", "FullWidthAndHeight")}
		/>
		<div className={bem(className, contentClassName, "content", "Elevated Rounded OverflowHidden")}>
			{children}
		</div>
	</div>
)

export interface ModalPropTypes extends BEMPropTypes {
	onClose: Handler,
	contentClassName?: BEMInput,
	backgroundClassName?: BEMInput,
}

export { ModalHeader, ModalButtons, ModalButton }
export { ModalHeaderPropTypes, ModalButtonPropTypes }

export default Modal