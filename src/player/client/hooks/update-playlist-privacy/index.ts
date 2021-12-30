import { MutationResult } from "@apollo/client"
import { InterfaceWithInput, PlaylistID, PlaylistPrivacy } from "@oly_op/music-app-common/types"

import { Playlist } from "../../types"
import { useMutation } from "../mutation"
import UPDATE_PLAYLIST_PRIVACY from "./update-playlist-privacy.gql"

export const useUpdatePlaylistPrivacy =
	({ playlistID }: PlaylistID): Result => {
		const [ mutate, result ] =
			useMutation<unknown, Vars>(UPDATE_PLAYLIST_PRIVACY)

		const handler =
			async (privacy: PlaylistPrivacy) => {
				await mutate({
					variables: {
						input: {
							playlistID,
							privacy: privacy.toUpperCase(),
						},
					},
				})
			}

		return [ handler, result ]
	}

interface Input extends
	Pick<Playlist, "playlistID"> { privacy: string }

type Vars =
	InterfaceWithInput<Input>

type Result = [
	updatePlaylistPrivacy:
		(privacy: PlaylistPrivacy) => Promise<void>,
	result: MutationResult<unknown>,
]