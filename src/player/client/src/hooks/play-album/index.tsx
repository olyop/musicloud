import isNull from "lodash-es/isNull"
import isUndefined from "lodash-es/isUndefined"
import { AlbumID } from "@oly_op/musicloud-common/build/types"

import { useQuery } from "../query"
import { useMutation } from "../mutation"
import { useResetPlayer } from "../reset-player"
import { useDispatch, togglePlay } from "../../redux"
import { PlayAlbumData, GetQueueNowPlayingData } from "./types"
import { updateNowPlayingMutationFunction } from "../../helpers"

import PLAY_ALBUM from "./play-album.gql"
import GET_ALBUM_NOW_PLAYING from "./get-album-now-playing.gql"

export const usePlayAlbum =
	(album: AlbumID | null) => {
		const dispatch = useDispatch()
		const resetPlayer = useResetPlayer()

		const [ playAlbum, result ] =
			useMutation<PlayAlbumData, AlbumID>(PLAY_ALBUM, {
				update: updateNowPlayingMutationFunction(({ playAlbum: { nowPlaying } }) => nowPlaying),
			})

		const { data } =
			useQuery<GetQueueNowPlayingData>(GET_ALBUM_NOW_PLAYING, {
				fetchPolicy: "cache-first",
			})

		const isPlaying = (
			!isNull(album) &&
			!isUndefined(data) &&
			!isNull(data.getQueue.nowPlaying) &&
			data.getQueue.nowPlaying.album.albumID === album.albumID
		)

		const handlePlayAlbum =
			() => {
				if (!result.loading && !isNull(album)) {
					if (isPlaying) {
						dispatch(togglePlay())
					} else {
						resetPlayer()
						void playAlbum({
							variables: { albumID: album.albumID	},
						})
					}
				}
			}

		return [ handlePlayAlbum, isPlaying, result ] as const
	}