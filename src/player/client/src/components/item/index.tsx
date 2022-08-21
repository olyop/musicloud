/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Link } from "react-router-dom"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import isUndefined from "lodash-es/isUndefined"
import { useState, createElement, Fragment, forwardRef } from "react"

import {
	PropTypes,
	InfoOptions,
	PlayOptions,
	ImageOptions,
	Modal as ItemModal,
} from "./types"

import PlayButton from "./play-button"

import "./index.scss"
import ItemInfo from "./info"

const bem =
	createBEM("Item")

const Item = forwardRef<HTMLDivElement, PropTypes>((propTypes, ref) => {
	const {
		left,
		modal,
		style,
		onClick,
		onRemove,
		leftIcon,
		className,
		playOptions,
		infoOptions,
		imageOptions,
		infoClassName,
		iconClassName,
		shareIcon = false,
		infoFadeInFromRight = false,
	} = propTypes

	const [ showModal, setShowModal ] =
		useState(false)

	const handleModalOpen =
		() => setShowModal(true)

	const handleModalClose =
		() => setShowModal(false)

	return (
		<div
			ref={ref}
			style={style}
			onClick={onClick}
			className={bem(className, "")}
			role={onClick ? "button" : undefined}
		>
			{leftIcon && (
				<Button
					transparent
					icon={leftIcon}
					title="Placeholder"
					className={bem("left-icon", "icon")}
				/>
			)}
			{!isUndefined(left) && !isUndefined(left) && (
				<p
					children={left}
					className={bem("left", "ParagraphOne")}
				/>
			)}
			{playOptions && (
				<PlayButton
					onClick={playOptions.onClick}
					isPlaying={playOptions.isPlaying}
					className={bem(iconClassName, "left-icon")}
				/>
			)}
			{imageOptions && (
				<Fragment>
					{imageOptions.path ? (
						<Link
							to={imageOptions.path}
							title={imageOptions.title}
							className={bem("img-link")}
							children={(
								<img
									src={imageOptions.url}
									crossOrigin="anonymous"
									alt={imageOptions.title}
									className={bem("img", "Card")}
								/>
							)}
						/>
					) : (
						<img
							src={imageOptions.url}
							crossOrigin="anonymous"
							alt={imageOptions.title}
							className={bem("img-link", "img", "Card")}
						/>
					)}
				</Fragment>
			)}
			{infoOptions && (
				<ItemInfo
					info={infoOptions}
					className={infoClassName}
					fadeInFromRight={infoFadeInFromRight}
				/>
			)}
			{modal && (
				<Button
					transparent
					title="Options"
					icon="more_vert"
					onClick={handleModalOpen}
					className={iconClassName}
				/>
			)}
			{onRemove && (
				<Button
					transparent
					icon="close"
					title="Close"
					onClick={onRemove}
					className={iconClassName}
				/>
			)}
			{shareIcon && (
				<Button
					transparent
					icon="share"
					title="Share"
					onClick={() => {}}
					className={iconClassName}
				/>
			)}
			{modal && (
				modal({
					open: showModal,
					onOpen: handleModalOpen,
					onClose: handleModalClose,
				})
			)}
		</div>
	)
})

export {
	ItemModal,
	InfoOptions,
	PlayOptions,
	ImageOptions,
}

export default Item