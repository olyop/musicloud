import {
	join,
	Pool,
	VariableInput,
	getResultExists,
	query as pgQuery,
	exists as pgExists,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import { UserInputError } from "apollo-server-fastify"
import { UserIDBase, ObjectIDBase } from "@oly_op/music-app-common/types"

import {
	INSERT_LIBRARY_OBJECT,
	EXISTS_LIBRARY_OBJECT,
	UPDATE_OBJECT_IN_LIBRARY,
} from "../../sql"

export interface HandleInLibraryOptions extends UserIDBase, ObjectIDBase {
	columnKey: string,
	tableName: string,
	inLibrary: boolean,
	columnName: string,
	returnQuery: string,
	columnNames: string[],
	libraryTableName: string,
}

export const handleInLibrary =
	(pool: Pool) =>
		async <T>({
			userID,
			objectID,
			inLibrary,
			columnKey,
			tableName,
			columnName,
			columnNames,
			returnQuery,
			libraryTableName,
		}: HandleInLibraryOptions) => {
			const client = await pool.connect()
			const query = pgQuery(client)
			const exists = pgExists(client)

			const doesObjectExist =
				await exists({
					value: objectID,
					table: tableName,
					column: columnName,
				})

			if (!doesObjectExist) {
				throw new UserInputError("Object does not exist.")
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
						parse: getResultExists,
						variables,
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

				returnResult =
					await query(returnQuery)({
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