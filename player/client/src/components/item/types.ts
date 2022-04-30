import { ReactNode, CSSProperties } from "react"
import { BEMInput } from "@oly_op/bem"

import { Handler, OnClickPropTypes } from "../../types"

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

// export interface InLibraryOptions {
// 	onClick: Handler,
// 	isError?: boolean,
// 	inLibrary: boolean,
// }

interface ClassNames {
	className?: string,
	infoClassName?: BEMInput,
	iconClassName?: BEMInput,
	rightClassName?: BEMInput,
}

interface Options {
	infoOptions: InfoOptions,
	playOptions?: PlayOptions,
	imageOptions?: ImageOptions,
	// inLibraryOptions?: InLibraryOptions,
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