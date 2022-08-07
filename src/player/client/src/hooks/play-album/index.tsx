import { AlbumID } from "@oly_op/musicloud-common/build/types"

import { useQuery } from "../query"
import PLAY_ALBUM from "./play-album.gql"
import { useMutation } from "../mutation"
import { useResetPlayer } from "../reset-player"
import { useDispatch, togglePlay } from "../../redux"
import GET_ALBUM_NOW_PLAYING from "./get-album-now-playing.gql"
import { PlayAlbumData, GetQueueNowPlayingData } from "./types"

export const usePlayAlbum =
	(album: AlbumID | null) => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()

		const [ playAlbum, result ] =
			useMutation<PlayAlbumData, AlbumID>(PLAY_ALBUM)

		const { data } =
			useQuery<GetQueueNowPlayingData>(GET_ALBUM_NOW_PLAYING, {
				fetchPolicy: "cache-first",
			})

		const isNowPlaying = (
			album !== null &&
			data !== undefined &&
			data.getQueue.nowPlaying !== null &&
			data.getQueue.nowPlaying.album.albumID === album.albumID
		)

		const handlePlayAlbum =
			() => {
				if (!result.loading && isNowPlaying && album !== null) {
					if (isNowPlaying) {
						dispatch(togglePlay())
					} else {
						resetPlayer()
						void playAlbum({
							variables: {
								albumID: album.albumID,
							},
						})
					}
				}
			}

		return [ handlePlayAlbum, isNowPlaying, result ] as const
	}