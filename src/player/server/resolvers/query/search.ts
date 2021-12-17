import { isEmpty } from "lodash"
import { ApolloError } from "apollo-server-fastify"
import { InterfaceWithInput } from "@oly_op/music-app-common/types"

import {
	getUser,
	getSong,
	getAlbum,
	getGenre,
	getArtist,
	getPlaylist,
} from "../helpers"

import resolver from "./resolver"
import { Search } from "../../types"

export const getSearchResults =
	resolver<Search[], GetSearchResultsArgs>(
		async ({ args, context }) => {
			const { value, length } = args.input

			const { hits } =
				await context.ag.search<Result>(value, {
					page: 0,
					hitsPerPage: length,
					getRankingInfo: true,
					attributesToHighlight: [],
					// filters: "NOT privacy:PRIVATE",
					attributesToRetrieve: ["*", "-image"],
				})

			const results =
				await Promise.all<Search>(
					hits.map(
						({ objectID, typeName }) => {
							switch (typeName) {
								case "User":
									return getUser(context.pg)({ userID: objectID })
								case "Song":
									return getSong(context.pg)({ songID: objectID })
								case "Genre":
									return getGenre(context.pg)({ genreID: objectID })
								case "Album":
									return getAlbum(context.pg)({ albumID: objectID })
								case "Artist":
									return getArtist(context.pg)({ artistID: objectID })
								case "Playlist":
									return getPlaylist(context.pg)({ playlistID: objectID })
								default:
									throw new ApolloError("Typename error")
							}
						},
					),
				)

			return results.filter(result => !isEmpty(result))
		},
	)

interface GetSearchResultsInput {
	value: string,
	length: number,
}

type GetSearchResultsArgs =
	InterfaceWithInput<GetSearchResultsInput>

interface Result {
	text: string,
	typeName: "User" | "Song" | "Genre" | "Album" | "Artist" | "Playlist",
}