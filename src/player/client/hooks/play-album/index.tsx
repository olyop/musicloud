import { AlbumIDBase } from "@oly_op/music-app-common/types"

import { useQuery } from "../query"
import PLAY_ALBUM from "./play-album.gql"
import { useMutation } from "../mutation"
import { useResetPlayer } from "../reset-player"
import GET_QUEUE_NOW_PLAYING from "./get-queue-now-playing.gql"
import { useDispatch, updatePlay, togglePlay } from "../../redux"
import { PlayAlbumData, GetQueueNowPlayingData, UsePlayAlbumResult } from "./types"

export const usePlayAlbum =
	({ albumID }: AlbumIDBase): UsePlayAlbumResult => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()

		const [ playAlbum, result ] =
			useMutation<PlayAlbumData, AlbumIDBase>(PLAY_ALBUM, {
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
						dispatch(updatePlay(true))
					}
				}
			}

		return [ handlePlayAlbum, isNowPlaying, result ]
	}