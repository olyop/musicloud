import {
	query,
	PoolOrClient,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import { SELECT_OBJECT_LIBRARY_DATE_ADDED } from "../../sql"
import { LibraryObject, GetLibraryObjectOptions } from "../../types"

export const getObjectDateAddedToLibrary =
	(client: PoolOrClient) => ({
		userID,
		objectID,
		columnName,
		libraryTableName,
	}: GetLibraryObjectOptions) =>
		query(client)(SELECT_OBJECT_LIBRARY_DATE_ADDED)({
			parse: result => (
				result.rowCount === 0 ?
					null :
					convertFirstRowToCamelCase<LibraryObject>()(result).dateAdded * 1000
			),
			variables: {
				userID,
				objectID,
				columnName,
				tableName: libraryTableName,
			},
		})