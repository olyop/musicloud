import { UserID } from "@oly_op/music-app-common/types"
import { exists, PoolOrClient } from "@oly_op/pg-helpers"

import { COLUMN_NAMES } from "../../../globals"

const userExists =
	(pg: PoolOrClient) =>
		({ userID }: UserID) =>
			exists(pg)({
				value: userID,
				table: "users",
				column: COLUMN_NAMES.USER[0],
			})

export default userExists