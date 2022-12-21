import { ObjectID, UserID } from "@oly_op/musicloud-common/build/types";
import {
	PoolOrClient,
	convertFirstRowToCamelCaseOrNull,
	getResultExists,
	importSQL,
	query,
} from "@oly_op/pg-helpers";
import { pipe } from "rxjs";

import { ColumnNameOptions, LibraryObject, TableNameOptions } from "../../../types";
import { pgEpochToJS } from "../pg-epoch-to-js";

const isf = importSQL(import.meta.url);

const SELECT_OBJECT_LIBRARY_DATE_ADDED = await isf("select-object-library-date-added");
const EXISTS_OBJECT_IN_LIBRARY = await isf("select-object-library-in-library");

export interface GetLibraryObjectOptions
	extends ObjectID,
		UserID,
		TableNameOptions,
		ColumnNameOptions {}

export const getObjectDateAddedToLibrary =
	(pg: PoolOrClient) =>
	({ userID, objectID, tableName, columnName }: GetLibraryObjectOptions) =>
		query(pg)(SELECT_OBJECT_LIBRARY_DATE_ADDED)({
			parse: pipe(
				convertFirstRowToCamelCaseOrNull<LibraryObject>(),
				result => result && pgEpochToJS(result.dateAdded),
			),
			variables: {
				userID,
				objectID,
				tableName: [tableName],
				columnName: [columnName],
			},
		});

export const getObjectInLibrary =
	(pg: PoolOrClient) =>
	({ userID, objectID, tableName, columnName }: GetLibraryObjectOptions) =>
		query(pg)(EXISTS_OBJECT_IN_LIBRARY)({
			parse: getResultExists,
			variables: {
				userID,
				objectID,
				tableName: [tableName],
				columnName: [columnName],
			},
		});
