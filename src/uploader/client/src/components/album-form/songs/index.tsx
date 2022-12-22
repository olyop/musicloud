import { createBEM } from "@oly_op/bem";
import isEmpty from "lodash-es/isEmpty";
import { FC, PropsWithChildren, createElement } from "react";

import { Song } from "../types";
import "./index.scss";

const bem = createBEM("AlbumSongs");

const AlbumSongs: FC<PropsWithChildren<PropTypes>> = ({ onAddSong, songs, children }) => (
	<div className={bem("", "FlexColumnGapQuart")}>
		<p className="TextField__label">Songs</p>
		<div className={bem("content", "Border Rounded FlexColumn")}>
			<div>
				{isEmpty(songs) ? <p className={bem("no-songs", "ParagraphOne")}>No songs...</p> : children}
			</div>
			<input
				multiple
				type="file"
				onChange={({ target: { files } }) => {
					// eslint-disable-next-line unicorn/prefer-spread
					void onAddSong(Array.from(files!));
				}}
			/>
		</div>
	</div>
);

export type OnAddSong = (files: File[]) => Promise<void>;

interface PropTypes {
	songs: Song[];
	onAddSong: OnAddSong;
}

export default AlbumSongs;
