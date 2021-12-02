import { AlbumID } from "@oly_op/music-app-common/types"

import { useQuery } from "../query"
import PLAY_ALBUM from "./play-album.gql"
import { useMutation } from "../mutation"
import { useResetPlayer } from "../reset-player"
import { useDispatch, togglePlay } from "../../redux"
import GET_QUEUE_NOW_PLAYING from "./get-queue-now-playing.gql"
import { PlayAlbumData, GetQueueNowPlayingData, UsePlayAlbumResult } from "./types"

export const usePlayAlbum =
	({ albumID }: AlbumID): UsePlayAlbumResult => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()

		const [ playAlbum, result ] =
			useMutation<PlayAlbumData, AlbumID>(PLAY_ALBUM, {
				variables: { albumID },
			})

		const { data } =
			useQuery<GetQueueNowPlayingData>(GET_QUEUE_NOW_PLAYING, {
				fetchPolicy: "cache-first",
			})

		const isNowPlaying = (
			data !== undefined &&
			data.getQueue.nowPlaying !== null &&
			data.getQueue.nowPlaying.album.albumID === albumID
		)

		const handlePlayAlbum =
			async () => {
				if (!result.loading) {
					if (isNowPlaying) {
						dispatch(togglePlay())
					} else {
						resetPlayer()
						await playAlbum()
					}
				}
			}

		return [ handlePlayAlbum, isNowPlaying, result ]
	}