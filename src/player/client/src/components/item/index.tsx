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

import "@oly_op/css-utilities/index.css"
import "@oly_op/react-button/build/index.css"
import "../../index.scss"

import "./index.scss"

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
		rightClassName,
		shareIcon = false,
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
			{infoOptions && (
				<div className={bem(infoClassName, "info", "MarginRightHalf")}>
					<div
						className={bem("info-left")}
						style={{
							justifyContent:
								infoOptions.lowerLeft ?
									undefined :
									"center",
						}}
					>
						<p
							children={infoOptions.upperLeft}
							className={bem("info-left-text", "BodyOneBold")}
						/>
						{infoOptions.lowerLeft && (
							<p
								children={infoOptions.lowerLeft}
								className={bem("info-left-text", "BodyTwo OverflowHidden")}
							/>
						)}
					</div>
					{(infoOptions.rightLeft || infoOptions.rightRight) && (
						<p className={bem(rightClassName, "info-right", "BodyTwo LightColor")}>
							{infoOptions.rightLeft}
							{(infoOptions.rightLeft && infoOptions.rightRight) && (
								<span className="MarginLeftRightQuart">&#8226;</span>
							)}
							{infoOptions.rightRight}
						</p>
					)}
				</div>
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