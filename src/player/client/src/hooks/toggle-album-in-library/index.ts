import { AlbumID } from "@oly_op/musicloud-common/build/types";
import isUndefined from "lodash-es/isUndefined";

import { useMutation } from "../mutation";
import { useQuery } from "../query";
import ADD_ALBUM_TO_LIBRARY from "./add-album-to-library.gql";
import GET_ALBUM_IN_LIBRARY from "./get-album-in-library.gql";
import REMOVE_ALBUM_FROM_LIBRARY from "./remove-album-from-library.gql";
import { AddData, QueryData, RemoveData } from "./types";
import { addUpdateFunction, removeUpdateFunction } from "./update";

export const useToggleAlbumInLibrary = ({ albumID }: AlbumID) => {
	const variables: AlbumID = { albumID };

	const { data, error: queryError } = useQuery<QueryData, AlbumID>(GET_ALBUM_IN_LIBRARY, {
		variables,
		hideLoading: true,
		fetchPolicy: "cache-first",
	});

	const [addToLibrary, addResult] = useMutation<AddData, AlbumID>(ADD_ALBUM_TO_LIBRARY, {
		variables,
		update: addUpdateFunction,
	});

	const [removeFromLibrary, removeResult] = useMutation<RemoveData, AlbumID>(
		REMOVE_ALBUM_FROM_LIBRARY,
		{ variables, update: removeUpdateFunction },
	);

	const loading = addResult.loading || removeResult.loading;

	const inLibrary = data ? data.getAlbumByID.inLibrary : false;

	const handleClick = () => {
		if (!loading && data && inLibrary) {
			void removeFromLibrary();
		} else {
			void addToLibrary();
		}
	};

	const isError =
		!isUndefined(queryError) || !isUndefined(addResult.error) || !isUndefined(removeResult.error);

	return [handleClick, inLibrary, isError] as const;
};
