import {
	join,
	VariableInput,
	getResultExists,
	exists as pgExists,
	query as pgHelpersQuery,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import { Pool } from "pg"
import { UserInputError } from "apollo-server-fastify"
import { UserIDBase, ObjectIDBase } from "@oly_op/music-app-common/types"

import {
	INSERT_LIBRARY_OBJECT,
	EXISTS_LIBRARY_OBJECT,
	UPDATE_OBJECT_IN_LIBRARY,
} from "../../sql"

import { TableNameOptions, ColumnNameOptions } from "../../types"

export interface HandleInLibraryOptionsBase
	extends UserIDBase, ObjectIDBase { inLibrary: boolean }

export interface HandleInLibraryOptions
	extends HandleInLibraryOptionsBase, TableNameOptions, ColumnNameOptions {
	columnKey: string,
	returnQuery: string,
	columnNames: string[],
	libraryTableName: string,
}

export const handleInLibrary =
	(pool: Pool) =>
		async <T>(options: HandleInLibraryOptions) => {
			const {
				userID,
				objectID,
				inLibrary,
				columnKey,
				tableName,
				columnName,
				columnNames,
				returnQuery,
				libraryTableName,
			} = options

			const client = await pool.connect()
			const query = pgHelpersQuery(client)
			const exists = pgExists(client)

			const doesObjectExist =
				await exists({
					log: { sql: true },
					value: objectID,
					table: tableName,
					column: columnName,
				})

			if (!doesObjectExist) {
				throw new UserInputError("Object does not exist")
			}

			let returnResult: T

			try {
				await query("BEGIN")()

				const variables: VariableInput = {
					userID,
					objectID,
					columnName,
					tableName: libraryTableName,
				}

				const doesLibraryObjectExist =
					await query(EXISTS_LIBRARY_OBJECT)({
						log: { sql: true },
						parse: getResultExists,
						variables,
					})

				if (doesLibraryObjectExist) {
					await query(UPDATE_OBJECT_IN_LIBRARY)({
						log: { sql: true },
						variables: {
							...variables,
							inLibrary,
						},
					})
				} else {
					await query(INSERT_LIBRARY_OBJECT)({
						log: { sql: true },
						variables: {
							...variables,
							inLibrary,
						},
					})
				}

				returnResult =
					await query(returnQuery)({
						log: { sql: true },
						parse: convertFirstRowToCamelCase<T>(),
						variables: {
							[columnKey]: objectID,
							columnNames: join(columnNames),
						},
					})

				await query("COMMIT")()
			} catch (error) {
				await query("ROLLBACK")()
				throw error
			} finally {
				client.release()
			}

			return returnResult
		}