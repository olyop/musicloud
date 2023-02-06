import { BEMInput } from "@oly_op/bem";
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types";
import isNull from "lodash-es/isNull";
import isUndefined from "lodash-es/isUndefined";
import { FC, Fragment, Ref, createElement, forwardRef } from "react";

import {
	createCatalogImageURL,
	createObjectPath,
	deserializeDuration,
	formatPlays,
	formatTimestampToDateTime,
} from "../../helpers";
import { usePlaySong } from "../../hooks";
import { useStateShowDuration, useStateShowGenres } from "../../redux";
import { Handler, ObjectShowIcon, Song as SongType } from "../../types";
import FeaturingArtists from "../featuring-artists";
import Item from "../item";
import ObjectLinks from "../object-links";
import SongTitle from "../song-title";
import Modal from "./modal";

const SongInner: FC<InnerPropTypes> = ({
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
}) => {
	const showGenres = useStateShowGenres();
	const showDuration = useStateShowDuration();

	const [playSong, isPlaying] = usePlaySong(hidePlay ? null : song);

	return (
		<Item
			dataIndex={index}
			onRemove={onRemove}
			dataID={song.songID}
			iconClassName={iconClassName}
			shareData={
				shareIcon
					? {
							title: song.title,
							url: createObjectPath("song", song.songID),
					  }
					: undefined
			}
			leftIcon={showIcon ? leftIcon : undefined}
			left={isUndefined(index) ? (hideTrackNumber ? undefined : song.trackNumber) : index}
			imageOptions={
				hideCover
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
				onJump
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
			infoOptions={{
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
			}}
			modal={
				hideModal
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
};

const Song = forwardRef<HTMLDivElement, WrapperPropTypes>(
	({ song, className, ...propTypes }, ref) => (
		<div
			ref={ref}
			className={className === null ? undefined : className || "PaddingHalf ItemBorder"}
		>
			{song && <SongInner song={song} {...propTypes} />}
		</div>
	),
);

interface PropTypes extends ObjectShowIcon {
	index?: number;
	onJump?: Handler;
	leftIcon?: string;
	onRemove?: Handler;
	hidePlay?: boolean;
	shareIcon?: boolean;
	hideCover?: boolean;
	hidePlays?: boolean;
	hideModal?: boolean;
	hideDuration?: boolean;
	hideInLibrary?: boolean;
	iconClassName?: BEMInput;
	ref?: Ref<HTMLDivElement>;
	hideTrackNumber?: boolean;
	showDateAddedToPlaylist?: boolean;
}

interface InnerPropTypes extends PropTypes {
	song: SongType;
}

interface WrapperPropTypes extends PropTypes {
	song: SongType | null;
	className?: string | null;
}

export default Song;
