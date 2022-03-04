import { SearchIndex } from "algoliasearch"
import { AlgoliaRecordUser, UserID } from "@oly_op/music-app-common/types"

import { ImageInput, InputBase } from "./types"
import determineCatalogImageURL from "./determine-catalog-image-url"

interface Options
	extends UserID, Omit<InputBase, "password"> {
	image: ImageInput,
}

const saveToAlogilia =
	(ag: SearchIndex) =>
		({ userID, name, image, emailAddress }: Options) => {
			const algoliaRecord: AlgoliaRecordUser = {
				name,
				followers: 0,
				emailAddress,
				typeName: "User",
				objectID: userID,
				image: determineCatalogImageURL(userID, image),
			}
			return ag.saveObject(algoliaRecord)
		}

export default saveToAlogilia