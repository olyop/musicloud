import { useNavigate } from "react-router-dom"
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"

import {
	CreatePlaylistData,
	CreatePlaylistVars,
	CreatePlayliistInput,
	UseCreatePlaylistResult,
} from "./types"

import update from "./update"
import { useMutation } from "../mutation"
import CREATE_PLAYLIST from "./create-playlist.gql"

export const useCreatePlaylist =
	(): UseCreatePlaylistResult => {
		const navigate = useNavigate()

		const [ createPlaylist, result ] =
			useMutation<CreatePlaylistData, CreatePlaylistVars>(
				CREATE_PLAYLIST,
				{ update },
			)

		const handleCreatePlaylist =
			async (input: CreatePlayliistInput) => {
				const { data } = await createPlaylist({ variables: { input } })
				const playlistID = removeDashesFromUUID(data!.createPlaylist.playlistID)
				navigate(`/playlist/${playlistID}`)
			}

		return [ handleCreatePlaylist, result ]
	}