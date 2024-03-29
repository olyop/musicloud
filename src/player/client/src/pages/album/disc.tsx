import { FC, Fragment, createElement } from "react";

import Song from "../../components/song";
import Songs from "../../components/songs";
import { Disc as DiscType } from "../../types";

const Disc: FC<PropTypes> = ({ isSingle, className, disc: { index, songs, hideLabel } }) => (
	<div className={className}>
		{hideLabel || (
			<h4 className="ParagraphTwo MarginBottomHalf UpperCase">
				<Fragment>Disc </Fragment>
				{index}
			</h4>
		)}
		<Songs songs={songs}>
			{songs.map(song => (
				<Song
					hideCover
					song={song}
					key={song.songID}
					hideTrackNumber={isSingle}
					className="PaddingHalf ItemBorder"
				/>
			))}
		</Songs>
	</div>
);

interface PropTypes {
	disc: DiscType;
	isSingle: boolean;
	className?: string;
}

export default Disc;
