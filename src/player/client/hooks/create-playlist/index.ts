import { useNavigate } from "react-router-dom"
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"

import update from "./update"
import { useMutation } from "../mutation"
import CREATE_PLAYLIST from "./create-playlist.gql"
import { Data, Vars, Input, Result } from "./types"

export const useCreatePlaylist =
	(): Result => {
		const navigate = useNavigate()

		const [ createPlaylist, result ] =
			useMutation<Data, Vars>(
				CREATE_PLAYLIST,
				{ update },
			)

		const handleCreatePlaylist =
			async (input: Input) => {
				const { data } = await createPlaylist({ variables: { input } })
				const playlistID = removeDashesFromUUID(data!.createPlaylist.playlistID)
				navigate(`/playlist/${playlistID}`)
			}

		return [ handleCreatePlaylist, result ]
	}