/* eslint-disable no-param-reassign */
import { MutableRefObject } from "react"

import { Update } from "./types"

const update =
	(isOptimistic: MutableRefObject<boolean>): Update =>
		(cache, result) => {
			if (result.data?.playSong.nowPlaying) {
				const { songID } =
					result.data.playSong.nowPlaying
				cache.modify({
					id: cache.identify({ __typename: "Queue" }),
					fields: {
						nowPlaying:
							(_, { toReference }) =>
								toReference({
									songID,
									__typename: "Song",
								})!,
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