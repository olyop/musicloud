import { Parse } from "@oly_op/pg-helpers"
import { UserIDBase, ObjectIDBase } from "@oly_op/music-app-common/types"

import { OrderBy } from "./other"

export interface GetObjectsOptions<T> extends ObjectIDBase {
	parse: Parse<T>,
	orderBy?: OrderBy,
}

interface GetLibraryObjectOptionsBase extends UserIDBase {
	columnName: string,
	libraryTableName: string,
}

export interface GetLibraryObjectOptions
	extends ObjectIDBase, GetLibraryObjectOptionsBase {}

export interface GetLibraryObjectsOptions extends GetLibraryObjectOptionsBase {
	page: number,
	orderBy: OrderBy,
	tableName: string,
	columnNames: string[],
}