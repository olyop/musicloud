import {
	AlgoliaRecordUser,
	NameBase,
	UserEmailAddressBase,
	UserID,
} from "@oly_op/musicloud-common/build/types";
import { SearchIndex } from "algoliasearch";

import determineCatalogImageURL from "./determine-catalog-image-url.js";
import { ImageInput } from "./types.js";

interface Options extends UserID, NameBase, UserEmailAddressBase {
	image: ImageInput;
}

const saveToAlgolia =
	(ag: SearchIndex) =>
	({ userID, name, image, emailAddress }: Options) => {
		const algoliaRecord: AlgoliaRecordUser = {
			name,
			followers: 0,
			emailAddress,
			typeName: "User",
			objectID: userID,
			image: determineCatalogImageURL(userID, image),
		};
		return ag.saveObject(algoliaRecord);
	};

export default saveToAlgolia;
