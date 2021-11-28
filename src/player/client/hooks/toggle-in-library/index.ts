/* eslint-disable no-underscore-dangle */
// import uniq from "lodash/uniq"
// import { useRef } from "react"
import isUndefined from "lodash/isUndefined"
import { MutationResult } from "@apollo/client"
// import { Modifier, Reference } from "@apollo/client/cache"

import { useQuery } from "../query"
// import { useUserID } from "../user-id"
import determineID from "./determine-id"
import { useMutation } from "../mutation"
import { InLibraryObjects } from "../../types"
import determineReturn from "./determine-return"

import GET_SONG from "./get-song-in-library.gql"
import GET_ARTIST from "./get-artist-in-library.gql"
import GET_PLAYLIST from "./get-playlist-in-library.gql"

import ADD_SONG from "./add-song-to-library.gql"
import ADD_ARTIST from "./add-artist-to-library.gql"
import ADD_PLAYLIST from "./add-playlist-to-library.gql"
import REMOVE_SONG from "./remove-song-from-library.gql"
import REMOVE_ARTIST from "./remove-artist-from-library.gql"
import REMOVE_PLAYLIST from "./remove-playlist-from-library.gql"

export const useToggleInLibrary =
	(object: InLibraryObjects) => {
		const dr = determineReturn(object)

		const typeName = dr("Song", "Artist", "Playlist")
		const QUERY = dr(GET_SONG, GET_ARTIST, GET_PLAYLIST)
		const objectIDKeys = dr("songID", "artistID", "playlistID")
		const typeNameLowerCase = dr("getSongByID", "getArtistByID", "getPlaylistByID")
		// const userLibraryKeys = dr("librarySongs", "libraryArtists", "libraryPlaylists")

		// const userID = useUserID()
		// const isOptimistic = useRef(true)
		const objectID = determineID(object)

		type Vars = {
			[K in typeof objectIDKeys]?: string
		}

		type QueryData = {
			[K in typeof typeNameLowerCase]?: InLibraryObjects
		}

		const variables: Vars =
			{ [objectIDKeys]: objectID }

		const { data: inLibraryData } =
			useQuery<QueryData, typeof variables>(QUERY, {
				variables,
				hideLoading: true,
				fetchPolicy: "cache-first",
			})

		const inLibrary =
		isUndefined(object.inLibrary) ?
			(inLibraryData ? inLibraryData[typeNameLowerCase]!.inLibrary : false) :
			object.inLibrary

		const actionVerb =
			inLibrary ? "remove" : "add"

		const locationVerb =
			inLibrary ? "From" : "To"

		const mutationName =
			`${actionVerb}${typeName}${locationVerb}Library` as const

		type MutationData = {
			[K in typeof mutationName]?: InLibraryObjects
		}

		const MUTATION = inLibrary ?
			dr(REMOVE_SONG, REMOVE_ARTIST, REMOVE_PLAYLIST) :
			dr(ADD_SONG, ADD_ARTIST, ADD_PLAYLIST)

		// const modifer =
		// 	(inLibraryMutation: boolean, cacheID: string): Modifier<Reference[]> =>
		// 		(existing, { readField, toReference }) => {
		// 			if (isOptimistic.current) {
		// 				isOptimistic.current = false
		// 				return existing
		// 			} else {
		// 				isOptimistic.current = true
		// 				if (inLibraryMutation) {
		// 					return uniq([
		// 						...existing,
		// 						toReference(cacheID)!,
		// 					])
		// 				} else {
		// 					return existing.filter(
		// 						reference => readField(objectIDKeys, reference) !== objectID,
		// 					)
		// 				}
		// 			}
		// 		}

		const [ mutate, result ] =
			useMutation<MutationData, Vars>(MUTATION, {
				variables,
				optimisticResponse: {
					[mutationName]: {
						__typename: typeName,
						inLibrary: !inLibrary,
						[objectIDKeys]: objectID,
					},
				},
				// update: (cache, { data }) => {
				// 	cache.modify({
				// 		id: cache.identify({ userID, __typename: "User" }),
				// 		fields: {
				// 			[userLibraryKeys]: modifer(
				// 				data![mutationName]?.inLibrary!,
				// 				cache.identify({
				// 					__typename: typeName,
				// 					[objectIDKeys]: objectID,
				// 				})!,
				// 			),
				// 		},
				// 	})
				// },
			})

		const handleClick =
			async () => {
				if (!result.loading) await mutate()
			}

		return [
			handleClick,
			inLibrary,
			result,
		] as [
			toggleInLibrary: () => Promise<void>,
			inLibrary: boolean,
			result: MutationResult<MutationData>,
		]
	}