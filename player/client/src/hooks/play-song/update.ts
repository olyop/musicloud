import { Update } from "./types"

const update: Update =
	({ isOptimistic, toggleIsOptimistic }) =>
		(cache, result) => {
			if (result.data?.playSong.nowPlaying) {
				const { songID } =
					result.data.playSong.nowPlaying
				cache.modify({
					id: cache.identify({ __typename: "Queue" }),
					fields: {
						nowPlaying:
							(value, { toReference }) =>
								toReference({
									songID,
									__typename: "Song",
								})!,
					},
				})
				if (isOptimistic) {
					toggleIsOptimistic(false)
					cache.modify({
						id: cache.identify({ songID, __typename: "Song" }),
						fields: {
							playsTotal:
								(cached: number) =>
									cached + 1,
						},
					})
				} else {
					toggleIsOptimistic(true)
				}
			}
		}

export default update