import { ReactNode } from "react"
import { BEMInput } from "@oly_op/bem"

import { Handler, OnClickPropTypes } from "../../types"
import { ModalButtonPropTypes, ModalHeaderPropTypes } from "../modal"

export interface ImageOptions {
	url: string,
	path: string,
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

export interface InLibraryOptions {
	onClick: Handler,
	inLibrary: boolean,
}

export interface ModalOptions {
	header?: ModalHeaderPropTypes,
	buttons?: ModalButtonPropTypes[],
	content?: (onClose: Handler) => ReactNode,
}

export interface PropTypes extends OnClickPropTypes {
	left?: ReactNode,
	leftIcon?: string,
	className?: string,
	onRemove?: Handler,
	modal?: ModalOptions,
	infoOptions: InfoOptions,
	infoClassName?: BEMInput,
	iconClassName?: BEMInput,
	playOptions?: PlayOptions,
	rightClassName?: BEMInput,
	imageOptions?: ImageOptions,
	inLibraryOptions?: InLibraryOptions,
}