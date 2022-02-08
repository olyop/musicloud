import { ReactNode, CSSProperties } from "react"
import { BEMInput } from "@oly_op/bem"

import { Handler, OnClickPropTypes } from "../../types"
import { ModalButtonPropTypes, ModalHeaderPropTypes } from "../modal"

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

export interface InLibraryOptions {
	onClick: Handler,
	isError?: boolean,
	inLibrary: boolean,
}

export interface ModalOptions {
	header?: ModalHeaderPropTypes,
	buttons?: ModalButtonPropTypes[],
	content?: (onClose: Handler) => ReactNode,
}

interface ClassNames {
	className?: string,
	infoClassName?: BEMInput,
	iconClassName?: BEMInput,
	rightClassName?: BEMInput,
}

interface Options {
	infoOptions: InfoOptions,
	playOptions?: PlayOptions,
	modalOptions?: ModalOptions,
	imageOptions?: ImageOptions,
	inLibraryOptions?: InLibraryOptions,
}

interface Other {
	left?: ReactNode,
	leftIcon?: string,
	onRemove?: Handler,
}

interface Style {
	style?: CSSProperties,
}

export interface PropTypes extends
	OnClickPropTypes,
	ClassNames,
	Options,
	Other,
	Style {}