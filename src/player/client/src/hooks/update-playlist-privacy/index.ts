import {
	InterfaceWithInput,
	PlaylistID,
	PlaylistPrivacy,
} from "@oly_op/musicloud-common/build/types";

import { Playlist } from "../../types";
import { useMutation } from "../mutation";
import UPDATE_PLAYLIST_PRIVACY from "./update-playlist-privacy.gql";

export const useUpdatePlaylistPrivacy = ({ playlistID }: PlaylistID) => {
	const [mutate, result] = useMutation<unknown, Vars>(UPDATE_PLAYLIST_PRIVACY);

	const handler = (privacy: PlaylistPrivacy) => {
		void mutate({
			variables: {
				input: {
					playlistID,
					privacy: privacy.toUpperCase(),
				},
			},
		});
	};

	return [handler, result] as const;
};

interface Input extends Pick<Playlist, "playlistID"> {
	privacy: string;
}

type Vars = InterfaceWithInput<Input>;
