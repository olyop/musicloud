import uniqueID from "lodash/uniqueId"
import { Link } from "react-router-dom"
import Image from "@oly_op/react-image"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { useState, createElement, VFC } from "react"

import {
	PropTypes,
	InfoOptions,
	PlayOptions,
	ImageOptions,
	ModalOptions,
	InLibraryOptions,
} from "./types"

import Window from "../window"
import PlayButton from "./play-button"
import InLibraryButton from "./in-library-button"
import Modal, { ModalHeader, ModalButton, ModalButtons } from "../modal"

import "./index.scss"

const bem =
	createBEM("Item")

const Item: VFC<PropTypes> = ({
	left,
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
		<div className={className}>
			<div className={bem("")} onClick={onClick}>
				{leftIcon && (
					<Button
						transparent
						icon={leftIcon}
						title="Placeholder"
						className={bem("icon")}
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
						className={bem(iconClassName, "play")}
					/>
				)}
				{imageOptions && (
					<Link
						to={imageOptions.path}
						title={imageOptions.title}
						className={bem("img-link")}
						children={(
							<Image
								url={imageOptions.url}
								className={bem("img", "Card")}
							/>
						)}
					/>
				)}
				<div className={bem(infoClassName, "info", "MarginRightHalf")}>
					<div
						className={bem("info-left")}
						style={{ justifyContent: lowerLeft ? "space-between" : "center" }}
					>
						<p
							children={upperLeft}
							className={bem("info-left-text", "BodyOneBold OverflowHidden")}
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
				<Window>
					{({ width }) => (
						width >= 700 && inLibraryOptions && (
							<InLibraryButton
								className={bem(iconClassName)}
								onClick={inLibraryOptions.onClick}
								inLibrary={inLibraryOptions.inLibrary}
							/>
						)
					)}
				</Window>
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
					<Modal open={showModal} onClose={handleModalClose}>
						{modalOptions.header && (
							<ModalHeader
								{...modalOptions.header}
							/>
						)}
						{modalOptions.content && (
							modalOptions.content(handleModalClose)
						)}
						{modalOptions.buttons && (
							<ModalButtons>
								{modalOptions.buttons.map(
									button => (
										<ModalButton
											{...button}
											key={uniqueID()}
											onClose={handleModalClose}
										/>
									),
								)}
							</ModalButtons>
						)}
					</Modal>
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
}

export default Item