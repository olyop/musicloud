import { isUndefined } from "lodash-es"
import { AlbumID } from "@oly_op/music-app-common/types"

import {
	Result,
	AddData,
	QueryData,
	RemoveData,
} from "./types"

import { useQuery } from "../query"
import { useMutation } from "../mutation"
import GET_ALBUM_IN_LIBRARY from "./get-album-in-library.gql"
import ADD_ALBUM_TO_LIBRARY from "./add-album-to-library.gql"
import { addUpdateFunction, removeUpdateFunction } from "./update"
import REMOVE_ALBUM_FROM_LIBRARY from "./remove-album-from-library.gql"

export const useToggleAlbumInLibrary =
	({ albumID }: AlbumID): Result => {
		const variables: AlbumID = { albumID }

		const { data, error: queryError } =
			useQuery<QueryData, AlbumID>(GET_ALBUM_IN_LIBRARY, {
				variables,
				hideLoading: true,
				fetchPolicy: "cache-first",
			})

		const [ addToLibrary, addResult ] =
			useMutation<AddData, AlbumID>(
				ADD_ALBUM_TO_LIBRARY,
				{ variables, update: addUpdateFunction },
			)

		const [ removeFromLibrary, removeResult ] =
			useMutation<RemoveData, AlbumID>(
				REMOVE_ALBUM_FROM_LIBRARY,
				{ variables, update: removeUpdateFunction },
			)

		const loading =
			addResult.loading || removeResult.loading

		const inLibrary =
			data ?
				data.getAlbumByID.inLibrary :
				false

		const handleClick =
			async () => {
				if (!loading && data && inLibrary) {
					await removeFromLibrary()
				} else {
					await addToLibrary()
				}
			}

		const isError =
			!isUndefined(queryError) ||
			!isUndefined(addResult.error) ||
			!isUndefined(removeResult.error)

		return [
			handleClick,
			inLibrary,
			isError,
		]
	}