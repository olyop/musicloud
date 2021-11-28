/* eslint-disable no-param-reassign */
import { MutableRefObject } from "react"

import { PlaySongUpdate } from "./types"

const update =
	(isOptimistic: MutableRefObject<boolean>): PlaySongUpdate =>
		(cache, result) => {
			if (result.data?.playSong.nowPlaying) {
				const { songID } =
					result.data.playSong.nowPlaying
				cache.modify({
					id: cache.identify({ __typename: "Queue" }),
					fields: {
						nowPlaying:
							(existing, { toReference }) =>
								toReference(
									cache.identify({
										songID,
										__typename: "Song",
									})!,
								)!,
					},
				})
				if (isOptimistic.current) {
					isOptimistic.current = false
					cache.modify({
						id: cache.identify({ songID, __typename: "Song" }),
						fields: {
							playsTotal:
								(cached: number) =>
									cached + 1,
						},
					})
				} else {
					isOptimistic.current = true
				}
			}
		}

export default update