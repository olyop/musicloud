import { PlaylistID, InterfaceWithInput } from "@oly_op/music-app-common/types"

import { Playlist } from "../../types"
import { useMutation } from "../mutation"
import UPDATE_PLAYLIST_TITLE from "./update-playlist-title.gql"

export const useUpdatePlaylistTitle =
	({ playlistID }: PlaylistID) => {
		const [ mutate, result ] =
			useMutation<Data, Vars>(UPDATE_PLAYLIST_TITLE, {
				optimisticResponse:
					({ input: { title } }) => ({
						updatePlaylistTitle: {
							title,
							playlistID,
							__typename: "Playlist",
						},
					}),
			})

		const handler =
			({ title }: InputBase) => {
				void mutate({
					variables: { input: { playlistID, title } },
				})
			}

		return [ handler, result ] as const
	}

type InputBase =
	Pick<Playlist, "title">

interface Input
	extends PlaylistID, InputBase {}

type Vars =
	InterfaceWithInput<Input>

interface Data {
	updatePlaylistTitle: Pick<Playlist, "playlistID" | "__typename" | "title">,
}