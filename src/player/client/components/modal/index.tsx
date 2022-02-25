import { isFunction } from "lodash-es"
import { createBEM, BEMInput } from "@oly_op/bem"
import { createElement, VFC, ReactNode } from "react"

import ModalButtons from "./modal-buttons"
import { ClassNameBEMPropTypes, Handler } from "../../types"
import ModalHeader, { ModalHeaderPropTypes } from "./modal-header"
import ModalButton, { ModalButtonPropTypes } from "./modal-button"

import "./index.scss"

const bem =
	createBEM("Modal")

const Modal: VFC<ModalPropTypes> = ({
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
			children={(
				isFunction(children) ?
					children(onClose) :
					children
			)}
		/>
	</div>
)

export interface ModalPropTypes extends ClassNameBEMPropTypes {
	open: boolean,
	onClose: Handler,
	contentClassName?: BEMInput,
	backgroundClassName?: BEMInput,
	children: ReactNode | ((onClose: Handler) => ReactNode),
}

export { ModalHeader, ModalButtons, ModalButton }
export { ModalHeaderPropTypes, ModalButtonPropTypes }

export default Modal