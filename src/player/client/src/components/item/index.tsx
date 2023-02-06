/* eslint-disable jsx-a11y/click-events-have-key-events */
import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import isUndefined from "lodash-es/isUndefined";
import { createElement, forwardRef, useState } from "react";

import { useShare } from "../../hooks";
import ItemImage from "./image";
import "./index.scss";
import ItemInfo from "./info";
import PlayButton from "./play-button";
import { ImageOptions, InfoOptions, Modal as ItemModal, PlayOptions, PropTypes } from "./types";

const bem = createBEM("Item");

const Item = forwardRef<HTMLDivElement, PropTypes>((propTypes, ref) => {
	const {
		left,
		modal,
		style,
		dataID,
		onClick,
		onRemove,
		leftIcon,
		className,
		shareData,
		dataIndex,
		playOptions,
		infoOptions,
		imageOptions,
		infoClassName,
		iconClassName,
		imageClassName,
		infoFadeInFromRight = false,
	} = propTypes;

	const [share, { shareIcon }] = useShare();
	const [showModal, setShowModal] = useState(false);

	const handleModalOpen = () => setShowModal(true);
	const handleModalClose = () => setShowModal(false);

	const handleShare = () => {
		if (shareData) {
			void share(shareData);
		}
	};

	return (
		<div
			ref={ref}
			style={style}
			data-id={dataID}
			onClick={onClick}
			data-index={dataIndex}
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
				<p children={left} className={bem("left", "ParagraphOne")} />
			)}
			{playOptions && (
				<PlayButton
					onClick={playOptions.onClick}
					isPlaying={playOptions.isPlaying}
					className={bem(iconClassName, "left-icon")}
				/>
			)}
			{imageOptions && <ItemImage options={imageOptions} className={imageClassName} />}
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
			{shareData && (
				<Button
					transparent
					title="Share"
					icon={shareIcon}
					onClick={handleShare}
					className={iconClassName}
				/>
			)}
			{modal &&
				modal({
					open: showModal,
					onOpen: handleModalOpen,
					onClose: handleModalClose,
				})}
		</div>
	);
});

export { ItemModal, InfoOptions, PlayOptions, ImageOptions };

export default Item;
