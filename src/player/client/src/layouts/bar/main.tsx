import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { FC, Fragment, createElement } from "react";
import { NavLink } from "react-router-dom";
import { AudioPlayerControls } from "react-use-audio-player";

import Song from "../../components/song";
import { Handler, Song as SongType } from "../../types";
import Progress from "./progress";
import Volume from "./volume";

const bem = createBEM("Bar");

const BarMain: FC<PropTypes> = ({ audio, nowPlaying, onExpandOpen }) => (
	<div className={bem("main", "PaddingHalf")}>
		<div className={bem("main-content-wrapper")}>
			<div className={bem("main-content")}>
				{nowPlaying ? (
					<Fragment>
						<Song
							hidePlay
							hidePlays
							hideDuration
							hideTrackNumber
							className={null}
							song={nowPlaying}
						/>
						<div className="FlexRowRight">
							<NavLink to="/queues">
								{({ isActive }) => (
									<Button title="Queue" icon="queue_music" transparent={!isActive} />
								)}
							</NavLink>
							<Volume />
							<Button
								transparent
								title="Player"
								icon="unfold_more"
								onClick={onExpandOpen}
								className={bem("main-content-expand")}
							/>
						</div>
					</Fragment>
				) : (
					<Fragment>
						<div />
						<div />
					</Fragment>
				)}
			</div>
		</div>
		<Progress audio={audio} nowPlaying={nowPlaying} />
	</div>
);

interface PropTypes {
	onExpandOpen: Handler;
	audio: AudioPlayerControls;
	nowPlaying: SongType | null;
}

export default BarMain;
