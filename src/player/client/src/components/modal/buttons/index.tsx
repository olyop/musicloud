import { createBEM } from "@oly_op/bem";
import { createElement, FC, PropsWithChildren } from "react";

import { ClassNameBEMPropTypes } from "../../../types";

import "./index.scss";

const bem = createBEM("ModalButtons");

const Buttons: FC<PropsWithChildren<ClassNameBEMPropTypes>> = ({ className, children }) => (
	<div className={bem(className, "")}>{children}</div>
);

export default Buttons;
