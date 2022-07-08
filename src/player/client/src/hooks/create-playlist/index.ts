import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"

import update from "./update"
import { useMutation } from "../mutation"
import { Data, Vars, Input } from "./types"
import CREATE_PLAYLIST from "./create-playlist.gql"

export const useCreatePlaylist =
	() => {
		const navigate = useNavigate()

		const [ createPlaylist, result ] =
			useMutation<Data, Vars>(
				CREATE_PLAYLIST,
				{ update },
			)

		const handleCreatePlaylist =
			(input: Input) => {
				void createPlaylist({ variables: { input } })
			}

		useEffect(() => {
			if (result.data) {
				const playlistID = removeDashesFromUUID(result.data.createPlaylist.playlistID)
				navigate(`/playlist/${playlistID}`)
			}
		}, [result.data])

		return [ handleCreatePlaylist, result ] as const
	}