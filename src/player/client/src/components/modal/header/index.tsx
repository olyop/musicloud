import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button/build"
import { createElement, ReactNode, FC } from "react"

import { Handler } from "../../../types"

import "./index.scss"

const canShare =
	() => "share" in navigator

const bem =
	createBEM("ModalHeader")

const Header: FC<ModalHeaderPropTypes> = ({
	text,
	icon,
	image,
	onClose,
	shareData,
	hideShare = false,
}) => {
	const handleShare =
		() => {
			if (!hideShare && onClose && "share" in navigator) {
				void navigator.share(shareData)
				onClose()
			}
		}

	return (
		<div className={bem("", "FlexRowGapHalfCenter ItemBorder PaddingLeftRightHalf")}>
			{icon && (
				<Button
					transparent
					icon={icon}
					className={bem("icon-left", "icon")}
				/>
			)}
			{image && (
				<img
					src={image.src}
					alt={image.description}
					crossOrigin="anonymous"
					className={bem("img", "Rounded")}
				/>
			)}
			<p className={bem("text", "BodyOne")}>
				{text}
			</p>
			{canShare() && !hideShare && shareData && (
				<Button
					transparent
					icon="share"
					title="Share"
					onClick={handleShare}
					className={bem("icon-share", "icon")}
				/>
			)}
		</div>
	)
}

interface ImageOptions {
	src: string,
	description: string,
}

export interface ModalHeaderPropTypes {
	icon?: string,
	text?: ReactNode,
	onClose?: Handler,
	hideShare?: boolean,
	image?: ImageOptions,
	shareData?: ShareData,
}

export default Header