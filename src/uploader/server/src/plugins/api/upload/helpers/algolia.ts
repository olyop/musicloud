import { SearchIndex } from "algoliasearch";
import { AlgoliaRecord, ObjectID } from "@oly_op/musicloud-common/build/types";

export const addRecordToSearchIndex =
	(ag: SearchIndex) =>
	async <T extends AlgoliaRecord>(input: T) => {
		await ag.saveObject(input);
	};

export const deleteRecordFromSearchIndex =
	(ag: SearchIndex) =>
	async ({ objectID }: ObjectID) =>
		ag.deleteObject(objectID);
