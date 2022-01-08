/* eslint-disable react/function-component-definition */
import { ObjectID } from "@oly_op/music-app-common/types"
import { Modifier, Reference } from "@apollo/client/cache"

import { InLibraryObject } from "../../types"

const modifer =
	(options: Options): Modifier<Reference[] | null> =>
		(existing, { readField, toReference }) => {
			const { objectTypeName, objectID, objectIDKey, object } = options
			if (object.inLibrary) {
				const objectRef =
					toReference({
						[objectIDKey]: objectID,
						__typename: objectTypeName,
					})!
				if (existing) {
					return [ ...existing, objectRef ]
				} else {
					return [ objectRef ]
				}
			} else {
				if (existing!.length === 1) {
					return null
				} else {
					return existing!.filter(
						ref => readField(objectIDKey, ref) !== objectID,
					)
				}
			}
		}

interface Options extends ObjectID {
	objectIDKey: string,
	objectTypeName: string,
	object: InLibraryObject,
}

export default modifer