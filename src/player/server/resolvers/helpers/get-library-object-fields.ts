import {
	query,
	PoolOrClient,
	getResultExists,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import { ObjectIDBase, UserIDBase } from "@oly_op/music-app-common/types"

import {
	EXISTS_OBJECT_IN_LIBRARY,
	SELECT_OBJECT_LIBRARY_DATE_ADDED,
} from "../../sql"

import { TableNameOptions, ColumnNameOptions, LibraryObject } from "../../types"

export interface GetLibraryObjectOptions
	extends ObjectIDBase, UserIDBase, TableNameOptions, ColumnNameOptions {}

export const getObjectDateAddedToLibrary =
	(client: PoolOrClient) =>
		({ userID, objectID, tableName, columnName }: GetLibraryObjectOptions) =>
			query(client)(SELECT_OBJECT_LIBRARY_DATE_ADDED)({
				parse: result => (
					result.rowCount === 0 ?
						null :
						convertFirstRowToCamelCase<LibraryObject>()(result).dateAdded * 1000
				),
				variables: {
					userID,
					objectID,
					tableName,
					columnName,
				},
			})

export const getObjectInLibrary =
	(client: PoolOrClient) =>
		({ userID, objectID, tableName, columnName }: GetLibraryObjectOptions) =>
			query(client)(EXISTS_OBJECT_IN_LIBRARY)({
				parse: getResultExists,
				variables: {
					userID,
					objectID,
					tableName,
					columnName,
				},
			})