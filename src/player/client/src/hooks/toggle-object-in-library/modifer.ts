/* eslint-disable react/function-component-definition */
import { Reference } from "@apollo/client/cache";
import { Modifier } from "@apollo/client/cache/core/types/common";
import { ObjectID } from "@oly_op/musicloud-common/build/types";

import { InLibraryObject } from "../../types";

const modifer =
	(options: Options): Modifier<Reference[] | null> =>
	(existing, { readField, toReference }) => {
		const { objectTypeName, objectID, objectIDKey, object } = options;
		if (object.inLibrary) {
			const objectRef = toReference({
				[objectIDKey]: objectID,
				__typename: objectTypeName,
			})!;
			if (existing) {
				return [...existing, objectRef];
			} else {
				return [objectRef];
			}
		} else {
			if (existing!.length === 1) {
				return null;
			} else {
				return existing!.filter(ref => readField(objectIDKey, ref) !== objectID);
			}
		}
	};

interface Options extends ObjectID {
	objectIDKey: string;
	objectTypeName: string;
	object: InLibraryObject<string>;
}

export default modifer;
