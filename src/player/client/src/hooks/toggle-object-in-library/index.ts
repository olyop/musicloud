import isUndefined from "lodash-es/isUndefined";

import { InLibraryObjects } from "../../types";
import { useMutation } from "../mutation";
import { useQuery } from "../query";
import ADD_ARTIST from "./add-artist-to-library.gql";
import ADD_PLAYLIST from "./add-playlist-to-library.gql";
import ADD_SONG from "./add-song-to-library.gql";
import determineID from "./determine-id";
import determineReturn from "./determine-return";
import GET_ARTIST from "./get-artist-in-library.gql";
import GET_PLAYLIST from "./get-playlist-in-library.gql";
import GET_SONG from "./get-song-in-library.gql";
import REMOVE_ARTIST from "./remove-artist-from-library.gql";
import REMOVE_PLAYLIST from "./remove-playlist-from-library.gql";
import REMOVE_SONG from "./remove-song-from-library.gql";

export const useToggleObjectInLibrary = <T extends InLibraryObjects>(object: T) => {
	const dr = determineReturn(object);
	const objectID = determineID(object);
	const QUERY = dr(GET_SONG, GET_ARTIST, GET_PLAYLIST);
	const objectTypeName = dr("Song", "Artist", "Playlist");
	const objectIDKey = dr("songID", "artistID", "playlistID");
	const typeNameLowerCase = dr("getSongByID", "getArtistByID", "getPlaylistByID");

	const variables = { [objectIDKey]: objectID } as Vars;

	const { data: inLibraryData, error: queryError } = useQuery<QueryData<T>, Vars>(QUERY, {
		variables,
		hideLoading: true,
		fetchPolicy: "cache-first",
	});

	const inLibrary = isUndefined(object.inLibrary)
		? inLibraryData
			? inLibraryData[typeNameLowerCase]!.inLibrary
			: false
		: object.inLibrary;

	const mutationName = inLibrary
		? (`remove${objectTypeName}FromLibrary` as const)
		: (`add${objectTypeName}ToLibrary` as const);

	const MUTATION = inLibrary
		? dr(REMOVE_SONG, REMOVE_ARTIST, REMOVE_PLAYLIST)
		: dr(ADD_SONG, ADD_ARTIST, ADD_PLAYLIST);

	const [mutate, { loading, error: mutationError }] = useMutation<MutationData<T>, Vars>(MUTATION, {
		variables,
		optimisticResponse: objectIDKey
			? {
					[mutationName]: {
						inLibrary: !inLibrary,
						[objectIDKey]: objectID,
						__typename: objectTypeName,
					},
			  }
			: undefined,
	});

	const handleClick = () => {
		if (!loading && objectIDKey) {
			void mutate();
		}
	};

	const isError = !isUndefined(queryError) || !isUndefined(mutationError);

	return [handleClick, inLibrary, isError] as const;
};

type Vars = Record<"songID" | "artistID" | "playlistID", string>;
type QueryData<T> = Record<"getSongByID" | "getArtistByID" | "getPlaylistByID", T>;

type MutationData<T> = Partial<
	Record<
		| "addSongToLibrary"
		| "addArtistToLibrary"
		| "addPlaylistToLibrary"
		| "removeSongFromLibrary"
		| "removeArtistFromLibrary"
		| "removePlaylistFromLibrary",
		T
	>
>;
