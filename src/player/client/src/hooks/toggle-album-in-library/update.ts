/* eslint-disable react/destructuring-assignment */

/* eslint-disable react/function-component-definition */
import { MutationUpdaterFunction, gql } from "@apollo/client";
import { ApolloCache, Reference } from "@apollo/client/cache";
import { Modifier } from "@apollo/client/cache/core/types/common";
import { AlbumID } from "@oly_op/musicloud-common/build/types";
import isEmpty from "lodash-es/isEmpty";

import { Album } from "../../types";
import { AddData, RemoveData } from "./types";

type ModiferFunction = Modifier<Reference[] | null>;

type UpdateFunction<Data> = MutationUpdaterFunction<Data, AlbumID, unknown, ApolloCache<unknown>>;

const addModiferFunction =
	(cache: ApolloCache<unknown>) =>
	({ albumID }: AlbumID): ModiferFunction =>
	(existing, { toReference }) => {
		if (existing) {
			const { songs } = cache.readFragment<Album>({
				id: cache.identify({ albumID, __typename: "Album" }),
				fragment: gql`
					fragment AlbumSongsFragment on Album {
						albumID
						songs {
							songID
						}
					}
				`,
			})!;
			return [
				...existing,
				...songs.map(({ songID, __typename }) => toReference({ songID, __typename })!),
			];
		} else {
			return null;
		}
	};

const removeModiferFunction =
	({ albumID }: AlbumID): ModiferFunction =>
	(existing, { readField }) => {
		if (existing) {
			const songs = existing.filter(
				ref => albumID !== readField("albumID", readField("album", ref)),
			);
			if (isEmpty(songs)) {
				return null;
			} else {
				return songs;
			}
		} else {
			return null;
		}
	};

export const addUpdateFunction: UpdateFunction<AddData> = (cache, { data }) => {
	cache.modify({
		id: cache.identify({ __typename: "Library" }),
		fields: {
			songsPaginated: addModiferFunction(cache)(data!.addAlbumToLibrary),
		},
	});
};

export const removeUpdateFunction: UpdateFunction<RemoveData> = (cache, { data }) => {
	cache.modify({
		id: cache.identify({ __typename: "Library" }),
		fields: {
			songsPaginated: removeModiferFunction(data!.removeAlbumFromLibrary),
		},
	});
};
