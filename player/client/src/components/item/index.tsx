import { Link } from "react-router-dom"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { useState, createElement, VFC, Fragment } from "react"

import {
	PropTypes,
	InfoOptions,
	PlayOptions,
	ImageOptions,
	ModalOptions,
	InLibraryOptions,
	ModalOptionsWithFunction,
} from "./types"

import ItemModal from "./modal"
import PlayButton from "./play-button"
import InLibraryButton from "./in-library-button"

import "./index.scss"

const bem =
	createBEM("Item")

const Item: VFC<PropTypes> = ({
	left,
	style,
	onClick,
	onRemove,
	leftIcon,
	className,
	playOptions,
	modalOptions,
	imageOptions,
	infoClassName,
	iconClassName,
	rightClassName,
	inLibraryOptions,
	infoOptions: {
		lowerLeft,
		rightLeft,
		upperLeft,
		rightRight,
	},
}) => {
	const [ showModal, setShowModal ] =
		useState(false)

	const handleModalOpen =
		() => setShowModal(true)

	const handleModalClose =
		() => setShowModal(false)

	return (
		<div style={style} className={className}>
			<div className={bem("")} onClick={onClick}>
				{leftIcon && (
					<Button
						transparent
						icon={leftIcon}
						title="Placeholder"
						className={bem("left-icon", "icon")}
					/>
				)}
				{left && (
					<p
						children={left}
						className={bem("left", "BodyOne")}
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
				<div className={bem(infoClassName, "info", "MarginRightHalf")}>
					<div
						className={bem("info-left")}
						style={{ justifyContent: lowerLeft ? undefined : "center" }}
					>
						<p
							children={upperLeft}
							className={bem("info-left-text", "BodyOneBold")}
						/>
						{lowerLeft && (
							<p
								children={lowerLeft}
								className={bem("info-left-text", "BodyTwo OverflowHidden")}
							/>
						)}
					</div>
					{(rightLeft || rightRight) && (
						<p className={bem(rightClassName, "info-right", "BodyTwo LightColor")}>
							{rightLeft}
							{(rightLeft && rightRight) && (
								<span className="MarginLeftRightQuart">&#8226;</span>
							)}
							{rightRight}
						</p>
					)}
				</div>
				{inLibraryOptions && (
					<InLibraryButton
						isError={inLibraryOptions.isError}
						onClick={inLibraryOptions.onClick}
						inLibrary={inLibraryOptions.inLibrary}
						className={bem(iconClassName, "in-library")}
					/>
				)}
				{modalOptions && (
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
				{modalOptions && (
					<ItemModal
						open={showModal}
						onClose={handleModalClose}
						modalOptions={modalOptions}
					/>
				)}
			</div>
		</div>
	)
}

export {
	InfoOptions,
	PlayOptions,
	ImageOptions,
	ModalOptions,
	InLibraryOptions,
	ModalOptionsWithFunction,
}

export default Item