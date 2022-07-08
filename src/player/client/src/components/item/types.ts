import { BEMInput } from "@oly_op/bem"
import { ReactNode, CSSProperties } from "react"

import { ClassNameBEMPropTypes, Handler, OnClickPropTypes } from "../../types"

export interface ImageOptions {
	url: string,
	path?: string,
	title: string,
}

export interface PlayOptions {
	onClick?: Handler,
	isPlaying: boolean,
}

export interface InfoOptions {
	upperLeft?: ReactNode,
	lowerLeft?: ReactNode,
	rightLeft?: ReactNode,
	rightRight?: ReactNode,
}

interface ClassNames extends ClassNameBEMPropTypes {
	infoClassName?: BEMInput,
	iconClassName?: BEMInput,
	rightClassName?: BEMInput,
}

interface Options {
	infoOptions?: InfoOptions,
	playOptions?: PlayOptions,
	imageOptions?: ImageOptions,
}

interface ModalOptions {
	open: boolean,
	onOpen: Handler,
	onClose: Handler,
}

export type Modal =
	(options: ModalOptions) => ReactNode

interface Other {
	modal?: Modal,
	left?: ReactNode,
	leftIcon?: string,
	onRemove?: Handler,
	shareIcon?: boolean,
	style?: CSSProperties,
}

export interface PropTypes extends
	OnClickPropTypes,
	ClassNames,
	Options,
	Other {}