import { Modifier, Reference } from "@apollo/client/cache"
import { ObjectIDBase } from "@oly_op/music-app-common/types"

interface Input extends ObjectIDBase {
	typeName: string,
	objectKey: string,
	inLibrary: boolean,
}

const modifer = ({
	inLibrary,
	objectKey,
	// objectID,
	// typeName,
}: Input): Modifier<Reference[]> =>
	(existing, { readField }) => {
		if (inLibrary) {
			return existing
			// return [...existing, {
			// 	__ref: readField<string>(objectKey, {
			// 		__typename: typeName,
			// 		[objectKey]: objectID,
			// 	})!,
			// }]
		} else {
			return existing
			// return existing.filter(
			// 	ref => readField(objectKey, ref) !== objectID,
			// )
		}
	}

export default modifer