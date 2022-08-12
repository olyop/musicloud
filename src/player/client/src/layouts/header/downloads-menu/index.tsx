import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { useApolloClient } from "@apollo/client"
import { useState, createElement, FC, Fragment, useEffect, ReactNode } from "react"

import { Status } from "./types"
import Song from "../../../components/song"
import Modal from "../../../components/modal"
import { Song as SongType } from "../../../types"
import downloadLibrary from "./download-library"

import "./index.scss"

const bem =
	createBEM("DownloadsMenu")

const DownloadsMenu: FC = () => {
	const client = useApolloClient()

	const [ showMenu, setShowMenu ] =
		useState(false)

	const [ isDownloading, setIsDownloading ] =
		useState(false)

	const [ currentDownload, setCurrentDownload ] =
		useState<SongType | null>(null)

	const [ downloadStatus, setDownloadStatus ] =
		useState<Status | null>(null)

	const handleMenuOpen =
		() => setShowMenu(true)

	const handleMenuClose =
		() => setShowMenu(false)

	const handleDownload =
		() => {
			if (!isDownloading) {
				setIsDownloading(true)
			}
		}

	useEffect(() => {
		if (isDownloading) {
			void (async () => {
				try {
					await downloadLibrary(client)(
						setCurrentDownload,
						setDownloadStatus,
					)
				} catch (error) {
					console.error(error)
				} finally {
					setShowMenu(false)
					setIsDownloading(false)
					setDownloadStatus(null)
					setCurrentDownload(null)
				}
			})()
		}
	}, [isDownloading])

	const downloadText: ReactNode =
		downloadStatus ? (
			<Fragment>
				{downloadStatus[0]}
				<Fragment> / </Fragment>
				{downloadStatus[1]}
			</Fragment>
		) : null

	return (
		<Fragment>
			<Button
				title="Downloads"
				text={downloadText}
				transparent={!showMenu}
				onClick={handleMenuOpen}
				icon={isDownloading ? "loop" : "download_for_offline"}
				iconClassName={isDownloading ? bem("downloading") : undefined}
			/>
			<Modal
				open={showMenu}
				onClose={handleMenuClose}
				backgroundClassName={bem("background")}
				contentClassName={bem("content", "PaddingHalf FlexColumnGapHalf")}
				children={(
					<Fragment>
						<h3 className="HeadingFive">
							Downloads
						</h3>
						{downloadStatus && (
							<p className="ParagraphTwo">
								{downloadText}
							</p>
						)}
						{currentDownload ? (
							<Song
								hidePlay
								hideModal
								hidePlays
								hideDuration
								hideInLibrary
								song={currentDownload}
								className={bem("content-song")}
							/>
						) : (
							<Fragment>
								<Button
									icon="cloud_download"
									text="Download Library"
									onClick={handleDownload}
									transparent={isDownloading}
									className={bem("content-button")}
								/>
								<p className="ParagraphTwo LightColor">
									Warning: uses lots of memory and data.
								</p>
							</Fragment>
						)}
					</Fragment>
				)}
			/>
		</Fragment>
	)
}

export default DownloadsMenu