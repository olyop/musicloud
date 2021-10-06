import Image from "@oly_op/react-image"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { useParams } from "react-router-dom"
import Metadata from "@oly_op/react-metadata"
import { createElement, FC, Fragment } from "react"
import { addDashesToUUID } from "@oly_op/uuid-dashes"
import deserializeDuration from "@oly_op/music-app-common/deserialize-duration"
import { ImageDimensions, ImageSizes, SongIDBase } from "@oly_op/music-app-common/types"

import {
	numberWithCommas,
	determineObjectPath,
	determineCatalogImageURL,
} from "../../helpers"

import { Song } from "../../types"
import GET_SONG_PAGE from "./get-song-page.gql"
import { useQuery, usePlaySong } from "../../hooks"
import ObjectLink from "../../components/object-link"
import ObjectLinks from "../../components/object-links"
import FeaturingArtists from "../../components/featuring-artists"

import "./index.scss"

const bem =
	createBEM("SongPage")

const SongPage: FC<PropTypes> = ({ song }) => {
	const [ playSong, isPlaying ] = usePlaySong(song)
	return (
		<Metadata title={song.title}>
			<div className={bem("", "Content PaddingTopBottom")}>
				<Image
					className="Elevated"
					title={song.album.title}
					url={determineCatalogImageURL(
						song.album.albumID,
						"cover",
						ImageSizes.FULL,
						ImageDimensions.SQUARE,
					)}
				/>
				<div>
					<div className="FlexListGapHalf MarginBottomHalf">
						<h1 className="HeadingFour">
							{song.title}
						</h1>
						<Button
							text="Play"
							transparent
							onClick={playSong}
							icon={isPlaying ? "pause" : "play_arrow"}
						/>
					</div>
					<h2 className="HeadingFive MarginBottomHalf">
						<FeaturingArtists
							song={song}
						/>
					</h2>
					<h3 className="BodyTwo MarginBottomHalf">
						<ObjectLink
							text={song.album.title}
							path={determineObjectPath("album", song.album.albumID)}
						/>
					</h3>
					<h3 className="BodyOne MarginBottom LightColor LightWeight">
						<ObjectLinks
							links={song.genres.map(({ genreID, name }) => ({
								text: name,
								path: determineObjectPath("genre", genreID),
							}))}
						/>
					</h3>
					<h4 className="BodyTwo MarginBottomQuart">
						Released:
						<Fragment> </Fragment>
						{song.album.released}
					</h4>
					<h4 className="BodyTwo MarginBottomQuart">
						Duration:
						<Fragment> </Fragment>
						{deserializeDuration(song.duration)}
					</h4>
					{song.playsTotal && (
						<h4 className="BodyTwo MarginBottomQuart">
							Plays:
							<Fragment> </Fragment>
							{numberWithCommas(song.playsTotal)}
						</h4>
					)}
					<h4 className="BodyTwo MarginBottomQuart">
						Size:
						<Fragment> </Fragment>
						{(song.size * 1e-6).toFixed(2)}
						<Fragment> MB</Fragment>
					</h4>
					<h4 className="BodyTwo MarginBottomQuart">
						BPM:
						<Fragment> </Fragment>
						{song.bpm}
						<Fragment> BPM</Fragment>
					</h4>
					<h4 className="BodyTwo">
						Key:
						<Fragment> </Fragment>
						{song.key.sharp}
					</h4>
				</div>
			</div>
		</Metadata>
	)
}

const SongPageWrapper: FC = () => {
	const params = useParams<SongIDBase>()
	const songID = addDashesToUUID(params.songID)
	const { data } = useQuery<Data, SongIDBase>(GET_SONG_PAGE, { variables: { songID } })
	return data ? <SongPage song={data.song}/> : null
}

interface Data {
	song: Song,
}

interface PropTypes {
	song: Song,
}

export default SongPageWrapper