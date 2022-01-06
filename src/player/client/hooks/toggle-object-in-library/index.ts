import { useRef } from "react"
import { isUndefined } from "lodash-es"
import { MutationResult } from "@apollo/client"

import modifer from "./modifer"
import { useQuery } from "../query"
import determineID from "./determine-id"
import { useMutation } from "../mutation"
import determineReturn from "./determine-return"
import { HandlerPromise, InLibraryObjects } from "../../types"

import GET_SONG from "./get-song-in-library.gql"
import GET_ARTIST from "./get-artist-in-library.gql"
import GET_PLAYLIST from "./get-playlist-in-library.gql"

import ADD_SONG from "./add-song-to-library.gql"
import ADD_ARTIST from "./add-artist-to-library.gql"
import ADD_PLAYLIST from "./add-playlist-to-library.gql"
import REMOVE_SONG from "./remove-song-from-library.gql"
import REMOVE_ARTIST from "./remove-artist-from-library.gql"
import REMOVE_PLAYLIST from "./remove-playlist-from-library.gql"

export const useToggleObjectInLibrary =
	(object: InLibraryObjects) => {
		const isOptimistic = useRef(true)
		const dr = determineReturn(object)
		const objectID = determineID(object)
		const QUERY = dr(GET_SONG, GET_ARTIST, GET_PLAYLIST)
		const objectTypeName = dr("Song", "Artist", "Playlist")
		const objectIDKey = dr("songID", "artistID", "playlistID")

		const typeNameLowerCase =
			dr("getSongByID", "getArtistByID", "getPlaylistByID")

		const libraryObjectKeyName =
			`${dr("songs", "artists", "playlists")}Paginated`

		type Vars = {
			[K in typeof objectIDKey]?: string
		}

		type QueryData = {
			[K in typeof typeNameLowerCase]?: InLibraryObjects
		}

		const variables: Vars =
			{ [objectIDKey]: objectID }

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
			`${actionVerb}${objectTypeName}${locationVerb}Library` as const

		type MutationData = {
			[K in typeof mutationName]?: InLibraryObjects
		}

		const MUTATION = inLibrary ?
			dr(REMOVE_SONG, REMOVE_ARTIST, REMOVE_PLAYLIST) :
			dr(ADD_SONG, ADD_ARTIST, ADD_PLAYLIST)

		const [ mutate, result ] =
			useMutation<MutationData, Vars>(MUTATION, {
				variables,
				optimisticResponse: {
					[mutationName]: {
						inLibrary: !inLibrary,
						[objectIDKey]: objectID,
						__typename: objectTypeName,
					},
				},
				update: (cache, { data }) => {
					if (!isOptimistic.current) {
						cache.modify({
							id: cache.identify({ __typename: "Library" }),
							fields: {
								[libraryObjectKeyName]:
									modifer({
										objectID,
										objectIDKey,
										objectTypeName,
										object: data![mutationName]!,
									}),
							},
						})
					}
					isOptimistic.current = !isOptimistic.current
				},
			})

		const handleClick =
			async () => {
				if (!result.loading) {
					await mutate()
				}
			}

		return [ handleClick, inLibrary, result ] as Result<MutationData>
	}

type Result<Data> = [
	toggleInLibrary: HandlerPromise,
	inLibrary: boolean,
	result: MutationResult<Data>,
]