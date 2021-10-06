import {
	query,
	PoolOrClient,
	getResultExists,
} from "@oly_op/pg-helpers"

import { GetLibraryObjectOptions } from "../../types"
import { EXISTS_OBJECT_IN_LIBRARY } from "../../sql"

export const getObjectInLibrary =
	(client: PoolOrClient) => ({
		userID,
		objectID,
		columnName,
		libraryTableName,
	}: GetLibraryObjectOptions) =>
		query(client)(EXISTS_OBJECT_IN_LIBRARY)({
			parse: getResultExists,
			variables: {
				userID,
				objectID,
				columnName,
				tableName: libraryTableName,
			},
		})