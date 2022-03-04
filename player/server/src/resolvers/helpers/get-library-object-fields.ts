import {
	query,
	PoolOrClient,
	getResultExists,
	convertFirstRowToCamelCaseOrNull,
} from "@oly_op/pg-helpers"

import { pipe } from "rxjs"
import { ObjectID, UserID } from "@oly_op/music-app-common/types"

import {
	EXISTS_OBJECT_IN_LIBRARY,
	SELECT_OBJECT_LIBRARY_DATE_ADDED,
} from "../../sql"

import { timeStampToMilliseconds } from "./time-stamp-to-milliseconds"
import { TableNameOptions, ColumnNameOptions, LibraryObject } from "../../types"

export interface GetLibraryObjectOptions
	extends ObjectID, UserID, TableNameOptions, ColumnNameOptions {}

export const getObjectDateAddedToLibrary =
	(client: PoolOrClient) =>
		({ userID, objectID, tableName, columnName }: GetLibraryObjectOptions) =>
			query(client)(SELECT_OBJECT_LIBRARY_DATE_ADDED)({
				parse: pipe(
					convertFirstRowToCamelCaseOrNull<LibraryObject>(),
					result => result && timeStampToMilliseconds(result.dateAdded),
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