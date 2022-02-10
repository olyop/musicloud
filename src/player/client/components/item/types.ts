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
	content?: ReactNode,
	header?: ModalHeaderPropTypes,
	buttons?: ModalButtonPropTypes[],
}

interface ClassNames {
	className?: string,
	infoClassName?: BEMInput,
	iconClassName?: BEMInput,
	rightClassName?: BEMInput,
}

export type ModalOptionsWithFunction =
	((onClose: Handler) => ModalOptions) | ModalOptions

export interface OptionsModal {
	modalOptions?: ModalOptionsWithFunction,
}

interface Options extends OptionsModal {
	infoOptions: InfoOptions,
	playOptions?: PlayOptions,
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