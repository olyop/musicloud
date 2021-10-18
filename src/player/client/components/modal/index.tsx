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
	open,
	onClose,
	children,
	className,
	contentClassName,
	backgroundClassName,
}) => (
	<div className={bem(open ? "visible" : "hidden", "")}>
		<div
			onClick={onClose}
			className={bem(
				backgroundClassName,
				open ? "background-visible" : "background-hidden",
				"background",
				"FullWidthAndHeight",
			)}
		/>
		<div
			className={bem(
				className,
				contentClassName,
				open ? "content-visible" : "content-hidden",
				"content",
				"Elevated Rounded OverflowHidden",
			)}
		>
			{children}
		</div>
	</div>
)

export interface ModalPropTypes extends BEMPropTypes {
	open: boolean,
	onClose: Handler,
	contentClassName?: BEMInput,
	backgroundClassName?: BEMInput,
}

export { ModalHeader, ModalButtons, ModalButton }
export { ModalHeaderPropTypes, ModalButtonPropTypes }

export default Modal