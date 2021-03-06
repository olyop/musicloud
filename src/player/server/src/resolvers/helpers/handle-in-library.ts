import {
	join,
	VariableInput,
	getResultExists,
	exists as pgExists,
	query as pgHelpersQuery,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import { Pool } from "pg"
import { UserInputError } from "apollo-server-errors"
import { UserID, ObjectID } from "@oly_op/musicloud-common"

import {
	INSERT_LIBRARY_OBJECT,
	EXISTS_LIBRARY_OBJECT,
	UPDATE_OBJECT_IN_LIBRARY,
} from "../../sql"

import { TableNameOptions, ColumnNameOptions } from "../../types"

export interface HandleInLibraryOptionsBase
	extends UserID, ObjectID { inLibrary: boolean }

export interface HandleInLibraryOptions
	extends HandleInLibraryOptionsBase, TableNameOptions, ColumnNameOptions {
	columnKey: string,
	returnQuery?: string,
	libraryTableName: string,
	columnNames: readonly string[],
}

export const handleInLibrary =
	(pool: Pool) =>
		async <T = void>(options: HandleInLibraryOptions) => {
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
						variables,
						parse: getResultExists,
					})

				if (doesLibraryObjectExist) {
					await query(UPDATE_OBJECT_IN_LIBRARY)({
						variables: {
							...variables,
							inLibrary,
						},
					})
				} else {
					await query(INSERT_LIBRARY_OBJECT)({
						variables: {
							...variables,
							inLibrary,
						},
					})
				}

				if (returnQuery) {
					returnResult =
						await query(returnQuery)({
							parse: convertFirstRowToCamelCase<T>(),
							variables: {
								[columnKey]: objectID,
								columnNames: join(columnNames),
							},
						})
				}

				await query("COMMIT")()
			} catch (error) {
				await query("ROLLBACK")()
				throw error
			} finally {
				client.release()
			}

			// @ts-ignore
			return returnResult
		}