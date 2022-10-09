import { QueryOptionsParse } from "@oly_op/pg-helpers";

export interface IndexOptions {
	index: number;
}

export interface TableNameOptions {
	tableName: string;
}

export interface ColumnNameOptions {
	columnName: string;
}

export interface GetObjectsOptions<T> extends QueryOptionsParse<T> {
	columnNames: string;
}
