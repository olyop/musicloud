import { BEMInput, createBEM } from "@oly_op/bem";
import isFunction from "lodash-es/isFunction";
import { FC, ReactNode, createElement } from "react";

import { ClassNameBEMPropTypes, Handler } from "../../types";
import ModalButton, { ModalButtonPropTypes } from "./button";
import ModalButtons from "./buttons";
import ModalHeader, { ModalHeaderPropTypes } from "./header";
import "./index.scss";

const bem = createBEM("Modal");

const Modal: FC<PropTypes> = ({
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
		{open && (
			<div
				className={bem(className, contentClassName, "content", "Elevated Rounded OverflowHidden")}
				children={isFunction(children) ? children(onClose) : children}
			/>
		)}
	</div>
);

export interface ModalOnClose {
	onClose: Handler;
}

export interface PropTypes extends ModalOnClose, ClassNameBEMPropTypes {
	open: boolean;
	contentClassName?: BEMInput;
	backgroundClassName?: BEMInput;
	children: ReactNode | ((onClose: Handler) => ReactNode);
}

export { ModalHeader, ModalButtons, ModalButton };
export { ModalHeaderPropTypes, ModalButtonPropTypes };

export default Modal;
