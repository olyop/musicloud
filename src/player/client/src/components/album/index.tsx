import { createBEM } from "@oly_op/bem";
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types";
import isNull from "lodash-es/isNull";
import { Fragment, createElement, forwardRef } from "react";
import { Link } from "react-router-dom";

import {
	createCatalogImageURL,
	createObjectPath,
	formatPlays,
	formatTimestamp,
} from "../../helpers";
import { usePlayAlbum } from "../../hooks";
import { useStateListStyle, useStateShowReleased } from "../../redux";
import { Album as AlbumType, ObjectShowIcon, SettingsListStyle } from "../../types";
import AlbumTitle from "../album-title";
import Item, { ItemModal, PlayOptions } from "../item";
import ObjectLinks from "../object-links";
import "./index.scss";
import AlbumModal from "./modal";

const bem = createBEM("Album");

const Album = forwardRef<HTMLDivElement, PropTypes>((propTypes, ref) => {
	const {
		album,
		className,
		showIcon = false,
		hidePlay = false,
		hidePlays = false,
		hideModal = false,
		alwaysList = false,
		hideReleased = false,
		hideInLibrary = false,
		infoFadeInFromRight = false,
	} = propTypes;

	const isAlbumNull = isNull(album);

	const listStyle = useStateListStyle();
	const showReleased = useStateShowReleased();

	const [playAlbum, isPlaying] = usePlayAlbum(hidePlay ? null : album);

	const modal: ItemModal | undefined =
		hideModal || isAlbumNull
			? undefined
			: ({ open, onClose }) => (
					<AlbumModal open={open} album={album} onClose={onClose} hideInLibrary={hideInLibrary} />
			  );

	const playOptions: PlayOptions | undefined =
		isAlbumNull || hidePlay
			? undefined
			: {
					isPlaying,
					onClick: playAlbum,
			  };

	return alwaysList || listStyle === SettingsListStyle.LIST ? (
		<Item
			ref={ref}
			modal={modal}
			playOptions={playOptions}
			infoFadeInFromRight={infoFadeInFromRight}
			leftIcon={showIcon ? "album" : undefined}
			className={bem(className, "PaddingHalf ItemBorder")}
			imageOptions={
				isAlbumNull
					? undefined
					: {
							path: createObjectPath("album", album.albumID),
							title: album.title,
							url: createCatalogImageURL(
								album.albumID,
								"cover",
								ImageSizes.MINI,
								ImageDimensions.SQUARE,
							),
					  }
			}
			infoOptions={
				isAlbumNull
					? undefined
					: {
							upperLeft: <AlbumTitle hideReleased album={album} />,
							lowerLeft: (
								<ObjectLinks
									links={album.artists.map(({ artistID, name }) => ({
										text: name,
										path: createObjectPath("artist", artistID),
									}))}
								/>
							),
							rightLeft:
								hidePlays || isNull(album.playsTotal) ? null : formatPlays(album.playsTotal),
							rightRight:
								hideReleased || !showReleased ? undefined : formatTimestamp(album.released),
					  }
			}
		/>
	) : (
		<div ref={ref} className={bem(className, "Card")}>
			{isAlbumNull || (
				<Fragment>
					<Link
						title={album.title}
						className={bem("cover")}
						to={createObjectPath("album", album.albumID)}
						children={
							<Fragment>
								<div className={bem("cover-black", "FullWidthAndHeight")} />
								<img
									alt={album.title}
									crossOrigin="anonymous"
									className={bem("cover-image", "FullWidthAndHeight")}
									src={createCatalogImageURL(
										album.albumID,
										"cover",
										ImageSizes.HALF,
										ImageDimensions.SQUARE,
									)}
								/>
							</Fragment>
						}
					/>
					<Item
						modal={modal}
						className="PaddingHalf"
						playOptions={playOptions}
						infoFadeInFromRight={infoFadeInFromRight}
						infoOptions={{
							upperLeft: <AlbumTitle album={album} />,
							lowerLeft: (
								<ObjectLinks
									links={album.artists.map(({ artistID, name }) => ({
										text: name,
										path: createObjectPath("artist", artistID),
									}))}
								/>
							),
						}}
					/>
				</Fragment>
			)}
		</div>
	);
});

interface PropTypes extends ObjectShowIcon {
	hidePlay?: boolean;
	className?: string;
	hidePlays?: boolean;
	hideModal?: boolean;
	alwaysList?: boolean;
	hideReleased?: boolean;
	album: AlbumType | null;
	hideInLibrary?: boolean;
	infoFadeInFromRight?: boolean;
}

export default Album;
