import uniqueId from "lodash/uniqueId"
import { Link } from "react-router-dom"
import Image from "@oly_op/react-image"
import Button from "@oly_op/react-button"
import { createBEM, BEMInput } from "@oly_op/bem"
import { useState, createElement, FC, ReactNode } from "react"

import Modal, {
	ModalHeader,
	ModalButton,
	ModalButtons,
	ModalHeaderPropTypes,
	ModalButtonPropTypes,
} from "../modal"

import PlayButton from "./play-button"
import InLibraryButton from "./in-library-button"
import { Handler, OnClickPropTypes } from "../../types"

import "./index.scss"

const bem =
	createBEM("Item")

const Item: FC<PropTypes> = ({
	left,
	onClick,
	onClose,
	leftIcon,
	className,
	modalHeader,
	playOptions,
	imageOptions,
	modalButtons,
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
	const [ modal, setModal ] = useState(false)
	const handleModalOpen = () => setModal(true)
	const handleModalClose = () => setModal(false)
	return (
		<div className={className}>
			<div className={bem("")} onClick={onClick}>
				{leftIcon && (
					<Button
						transparent
						icon={leftIcon}
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
							className={bem("info-left-text", "BodyOneBold")}
						/>
						{lowerLeft && (
							<p
								children={lowerLeft}
								className={bem("info-left-text", "BodyTwo")}
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
						onClick={inLibraryOptions.onClick}
						className={bem(iconClassName, "add")}
						inLibrary={inLibraryOptions.inLibrary}
					/>
				)}
				{modalButtons && (
					<Button
						transparent
						icon="more_vert"
						onClick={handleModalOpen}
						className={iconClassName}
					/>
				)}
				{onClose && (
					<Button
						transparent
						icon="close"
						onClick={onClose}
						className={iconClassName}
					/>
				)}
				{modalButtons && modal && (
					<Modal onClose={handleModalClose}>
						{modalHeader && (
							<ModalHeader
								{...modalHeader}
							/>
						)}
						<ModalButtons>
							{modalButtons.map(
								button => (
									<ModalButton
										{...{
											...button,
											onClick: () => {
												handleModalClose()
												if (button.onClick) button.onClick()
											},
										}}
										key={uniqueId()}
									/>
								),
							)}
						</ModalButtons>
					</Modal>
				)}
			</div>
		</div>
	)
}

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

export interface PropTypes extends OnClickPropTypes {
	left?: ReactNode,
	onClose?: Handler,
	leftIcon?: string,
	className?: string,
	infoOptions: InfoOptions,
	infoClassName?: BEMInput,
	iconClassName?: BEMInput,
	playOptions?: PlayOptions,
	rightClassName?: BEMInput,
	imageOptions?: ImageOptions,
	modalHeader?: ModalHeaderPropTypes,
	inLibraryOptions?: InLibraryOptions,
	modalButtons?: ModalButtonPropTypes[],
}

export default Item