import {
	join,
	query,
	PoolOrClient,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import pipe from "@oly_op/pipe"

import { User } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { SELECT_USER_BY_ID } from "../../sql"

export const getUserNowPlaying =
	(client: PoolOrClient) =>
		(userID: string) =>
			query(client)(SELECT_USER_BY_ID)({
				parse: pipe(
					convertFirstRowToCamelCase<User>(),
					({ nowPlaying }) => nowPlaying,
				),
				variables: {
					userID,
					columnNames: join(COLUMN_NAMES.USER),
				},
			})