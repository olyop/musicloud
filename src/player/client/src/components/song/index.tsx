import { BEMInput } from "@oly_op/bem";
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types";
import isNull from "lodash-es/isNull";
import isUndefined from "lodash-es/isUndefined";
import { Fragment, Ref, createElement, forwardRef } from "react";

import {
	createCatalogImageURL,
	createObjectPath,
	deserializeDuration,
	formatPlays,
	formatTimestampToDateTime,
} from "../../helpers";
import { usePlaySong } from "../../hooks";
import { useStateShowDuration, useStateShowGenres } from "../../redux";
import { ClassNameBEMPropTypes, Handler, ObjectShowIcon, Song as SongType } from "../../types";
import FeaturingArtists from "../featuring-artists";
import Item from "../item";
import ObjectLinks from "../object-links";
import SongTitle from "../song-title";
import Modal from "./modal";

const Song = forwardRef<HTMLDivElement, PropTypes>((propTypes, ref) => {
	const {
		song,
		index,
		onJump,
		onRemove,
		iconClassName,
		showIcon = false,
		hidePlay = false,
		hideCover = false,
		hidePlays = false,
		hideModal = false,
		shareIcon = false,
		hideDuration = false,
		hideInLibrary = false,
		leftIcon = "audiotrack",
		hideTrackNumber = false,
		showDateAddedToPlaylist = false,
		className = "ItemBorder PaddingHalf",
	} = propTypes;

	const isSongNull = isNull(song);
	const showGenres = useStateShowGenres();
	const showDuration = useStateShowDuration();

	const [playSong, isPlaying] = usePlaySong(hidePlay ? null : song);

	return (
		<Item
			ref={ref}
			onRemove={onRemove}
			className={className}
			iconClassName={iconClassName}
			shareData={
				!isSongNull && shareIcon
					? {
							title: song.title,
							url: createObjectPath("song", song.songID),
					  }
					: undefined
			}
			leftIcon={showIcon ? leftIcon : undefined}
			left={
				isSongNull
					? undefined
					: isUndefined(index)
					? hideTrackNumber
						? undefined
						: song.trackNumber
					: index
			}
			imageOptions={
				isSongNull || hideCover
					? undefined
					: {
							title: song.album.title,
							path: createObjectPath("album", song.album.albumID),
							url: createCatalogImageURL(
								song.album.albumID,
								"cover",
								ImageSizes.HALF,
								ImageDimensions.SQUARE,
							),
					  }
			}
			playOptions={
				isSongNull
					? undefined
					: onJump
					? {
							onClick: onJump,
							isPlaying: false,
					  }
					: hidePlay
					? undefined
					: {
							isPlaying,
							onClick: playSong,
					  }
			}
			infoOptions={
				isSongNull
					? undefined
					: {
							upperLeft: <SongTitle song={song} />,
							lowerLeft: (
								<Fragment>
									<FeaturingArtists song={song} />
									{showGenres && (
										<Fragment>
											<Fragment> &#8226; </Fragment>
											<ObjectLinks
												ampersand
												links={song.genres.map(({ genreID, name }) => ({
													text: name,
													path: createObjectPath("genre", genreID),
												}))}
											/>
										</Fragment>
									)}
								</Fragment>
							),
							rightLeft:
								showDateAddedToPlaylist && !isNull(song.dateAddedToPlaylist)
									? formatTimestampToDateTime(song.dateAddedToPlaylist)
									: hidePlays || isNull(song.playsTotal)
									? null
									: formatPlays(song.playsTotal),
							rightRight: showDuration
								? hideDuration
									? null
									: deserializeDuration(song.duration)
								: null,
					  }
			}
			modal={
				isSongNull || hideModal
					? undefined
					: ({ open, onClose }) => (
							<Modal
								open={open}
								song={song}
								onClose={onClose}
								hidePlay={hidePlay}
								onRemove={onRemove}
								hideInLibrary={hideInLibrary}
							/>
					  )
			}
		/>
	);
});

interface PropTypes extends ObjectShowIcon, ClassNameBEMPropTypes {
	index?: number;
	onJump?: Handler;
	leftIcon?: string;
	onRemove?: Handler;
	hidePlay?: boolean;
	shareIcon?: boolean;
	hideCover?: boolean;
	hidePlays?: boolean;
	hideModal?: boolean;
	song: SongType | null;
	hideDuration?: boolean;
	hideInLibrary?: boolean;
	iconClassName?: BEMInput;
	ref?: Ref<HTMLDivElement>;
	hideTrackNumber?: boolean;
	showDateAddedToPlaylist?: boolean;
}

export default Song;
