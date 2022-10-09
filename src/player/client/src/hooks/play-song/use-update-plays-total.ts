import { SongID } from "@oly_op/musicloud-common/build/types";

import { useApolloClient } from "../../apollo";

const useUpdatePlaysTotal = (song: SongID | null) => {
	const apollo = useApolloClient();
	return () => {
		if (song) {
			const { songID } = song;
			apollo.cache.modify({
				id: apollo.cache.identify({ songID, __typename: "Song" }),
				fields: {
					playsTotal: (cached: number) => cached + 1,
				},
			});
		}
	};
};

export default useUpdatePlaysTotal;
