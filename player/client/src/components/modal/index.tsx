import isFunction from "lodash-es/isFunction"
import { createBEM, BEMInput } from "@oly_op/bem"
import { createElement, FC, ReactNode } from "react"

import { ClassNameBEMPropTypes, Handler } from "../../types"

import ModalButtons from "./buttons"
import ModalHeader, { ModalHeaderPropTypes } from "./header"
import ModalButton, { ModalButtonPropTypes } from "./button"

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
			aria-hidden
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
			children={open ? (
				isFunction(children) ?
					children(onClose) :
					children
			) : undefined}
		/>
	</div>
)

export interface ModalOnClose {
	onClose: Handler,
}

export interface ModalPropTypes extends ModalOnClose, ClassNameBEMPropTypes {
	open: boolean,
	contentClassName?: BEMInput,
	backgroundClassName?: BEMInput,
	children: ReactNode | ((onClose: Handler) => ReactNode),
}

export { ModalHeader, ModalButtons, ModalButton }
export { ModalHeaderPropTypes, ModalButtonPropTypes }

export default Modal