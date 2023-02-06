import { useApolloClient } from "@apollo/client";
import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { FC, Fragment, ReactNode, createElement, useEffect, useState } from "react";

import Modal from "../../../components/modal";
import Song from "../../../components/song";
import { useStateOrderBy } from "../../../redux";
import {
	AlbumsOrderByField,
	LibrarySongsOrderByField,
	Song as SongType,
	SongsOrderByField,
} from "../../../types";
import downloadLibrary from "./download-library";
import "./index.scss";
import { Status } from "./types";

const bem = createBEM("DownloadsMenu");

const DownloadsMenu: FC = () => {
	const client = useApolloClient();
	const songsOrderBy = useStateOrderBy<SongsOrderByField>("songs");
	const albumsOrderBy = useStateOrderBy<AlbumsOrderByField>("albums");
	const librarySongsOrderBy = useStateOrderBy<LibrarySongsOrderByField>("librarySongs");

	const [showMenu, setShowMenu] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);
	const [downloadText, setDownloadText] = useState<string | null>(null);
	const [downloadStatus, setDownloadStatus] = useState<Status | null>(null);
	const [currentDownload, setCurrentDownload] = useState<SongType | null>(null);

	const handleMenuOpen = () => setShowMenu(true);

	const handleMenuClose = () => setShowMenu(false);

	const handleDownload = () => {
		if (!isDownloading) {
			setIsDownloading(true);
		}
	};

	useEffect(() => {
		if (isDownloading) {
			void (async () => {
				try {
					await downloadLibrary(client)({
						songsOrderBy,
						albumsOrderBy,
						setDownloadText,
						setCurrentDownload,
						setDownloadStatus,
						librarySongsOrderBy,
					});
				} catch (error) {
					console.error(error);
				} finally {
					setShowMenu(false);
					setDownloadText(null);
					setIsDownloading(false);
					setDownloadStatus(null);
					setCurrentDownload(null);
				}
			})();
		}
	}, [isDownloading]);

	const downloadStatusText: ReactNode = downloadStatus ? (
		<Fragment>
			{downloadStatus[0]}
			<Fragment> / </Fragment>
			{downloadStatus[1]}
		</Fragment>
	) : null;

	return (
		<Fragment>
			<Button
				title="Downloads"
				transparent={!showMenu}
				onClick={handleMenuOpen}
				text={downloadStatusText}
				icon={isDownloading ? "loop" : "download_for_offline"}
				iconClassName={isDownloading ? bem("downloading") : undefined}
			/>
			<Modal
				open={showMenu}
				onClose={handleMenuClose}
				backgroundClassName={bem("background")}
				contentClassName={bem("content", "PaddingHalf FlexColumnGapHalf")}
				children={
					<Fragment>
						<h3 className="HeadingFive">Downloads</h3>
						{downloadStatusText && <p className="ParagraphTwo">{downloadStatusText}</p>}
						{currentDownload ? (
							<Fragment>
								<Song
									hidePlay
									hideModal
									hidePlays
									hideDuration
									hideInLibrary
									song={currentDownload}
									className={bem("content-song")}
								/>
								<p className="ParagraphTwo LightColor">{downloadText}</p>
							</Fragment>
						) : (
							<Fragment>
								<Button
									icon="cloud_download"
									text="Download Library"
									onClick={handleDownload}
									transparent={isDownloading}
									className={bem("content-button")}
								/>
								<p className="ParagraphTwo LightColor">Warning: uses lots of memory and data.</p>
							</Fragment>
						)}
					</Fragment>
				}
			/>
		</Fragment>
	);
};

export default DownloadsMenu;
