import { BEMInput } from "@oly_op/bem";
import { CSSProperties, ReactNode } from "react";

import { ClassNameBEMPropTypes, Handler, OnClickPropTypes } from "../../types";

export interface ImageOptions {
	url: string;
	path?: string;
	title: string;
}

export interface PlayOptions {
	onClick?: Handler;
	isPlaying: boolean;
}

export interface InfoOptions {
	upperLeft?: ReactNode;
	lowerLeft?: ReactNode;
	rightLeft?: ReactNode;
	rightRight?: ReactNode;
}

interface ClassNames extends ClassNameBEMPropTypes {
	infoClassName?: BEMInput;
	iconClassName?: BEMInput;
	imageClassName?: BEMInput;
}

interface Options {
	infoOptions?: InfoOptions;
	playOptions?: PlayOptions;
	imageOptions?: ImageOptions;
}

interface ModalOptions {
	open: boolean;
	onOpen: Handler;
	onClose: Handler;
}

export type Modal = (options: ModalOptions) => ReactNode;

interface Other {
	modal?: Modal;
	left?: ReactNode;
	leftIcon?: string;
	onRemove?: Handler;
	shareData?: ShareData;
	style?: CSSProperties;
	infoFadeInFromRight?: boolean;
}

export interface PropTypes extends OnClickPropTypes, ClassNames, Options, Other {}
