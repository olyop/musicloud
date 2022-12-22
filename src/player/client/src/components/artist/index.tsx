import { createBEM } from "@oly_op/bem";
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types";
import isNull from "lodash-es/isNull";
import { createElement, forwardRef } from "react";
import { NavLink } from "react-router-dom";

import { createCatalogImageURL, createObjectPath } from "../../helpers";
import { useShuffleArtist } from "../../hooks";
import { useStateListStyle } from "../../redux";
import { Artist as ArtistType, ObjectShowIcon, SettingsListStyle } from "../../types";
import ArtistLower from "../artist-lower";
import Item, { ImageOptions, InfoOptions, ItemModal, PlayOptions } from "../item";
import ObjectLink from "../object-link";
import "./index.scss";
import Modal from "./modal";

const bem = createBEM("Artist");

const Artist = forwardRef<HTMLDivElement, PropTypes>((propTypes, ref) => {
	const {
		artist,
		className,
		showIcon = false,
		hidePlay = false,
		hideModal = false,
		alwaysList = false,
		hideInLibrary = false,
		hideArtistLower = false,
	} = propTypes;

	const isArtistNull = isNull(artist);
	const listStyle = useStateListStyle();

	const [shuffleArtist] = useShuffleArtist(artist);

	const playOptions: PlayOptions | undefined = hidePlay
		? undefined
		: {
				isPlaying: false,
				onClick: shuffleArtist,
		  };

	const info: InfoOptions | undefined = isArtistNull
		? undefined
		: {
				lowerLeft: hideArtistLower ? undefined : <ArtistLower artist={artist} />,
				upperLeft: (
					<ObjectLink
						link={{
							text: artist.name,
							path: createObjectPath("artist", artist.artistID),
						}}
					/>
				),
		  };

	const imageOptions: ImageOptions | undefined = isArtistNull
		? undefined
		: {
				title: artist.name,
				path: createObjectPath("artist", artist.artistID),
				url: createCatalogImageURL(
					artist.artistID,
					"profile",
					ImageSizes.MINI,
					ImageDimensions.SQUARE,
				),
		  };

	const modal: ItemModal | undefined =
		hideModal || isArtistNull
			? undefined
			: ({ open, onClose }) => (
					<Modal open={open} artist={artist} onClose={onClose} hideInLibrary={hideInLibrary} />
			  );

	return listStyle === SettingsListStyle.LIST || alwaysList ? (
		<Item
			ref={ref}
			modal={modal}
			infoOptions={info}
			playOptions={playOptions}
			imageOptions={imageOptions}
			leftIcon={showIcon ? "person" : undefined}
			className={bem(className, "PaddingHalf ItemBorder")}
		/>
	) : (
		<div ref={ref} className={bem(className, "Card Elevated")}>
			{artist && (
				<NavLink
					title={artist.name}
					className={bem("cover")}
					to={createObjectPath("artist", artist.artistID)}
				>
					<div className={bem("cover-black", "FullWidthAndHeight")} />
					<img
						alt={artist.name}
						crossOrigin="anonymous"
						className={bem("cover-image", "FullWidthAndHeight")}
						src={createCatalogImageURL(
							artist.artistID,
							"cover",
							ImageSizes.HALF,
							ImageDimensions.LANDSCAPE,
						)}
					/>
				</NavLink>
			)}
			<Item modal={modal} infoOptions={info} className="PaddingHalf" playOptions={playOptions} />
		</div>
	);
});

interface PropTypes extends ObjectShowIcon {
	hidePlay?: boolean;
	className?: string;
	hideModal?: boolean;
	alwaysList?: boolean;
	hideInLibrary?: boolean;
	artist: ArtistType | null;
	hideArtistLower?: boolean;
}

export default Artist;
