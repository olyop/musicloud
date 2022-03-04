import { exists, PoolOrClient } from "@oly_op/pg-helpers"
import { UserEmailAddress } from "@oly_op/music-app-common/types"

export const emailAddressExists =
	(pg: PoolOrClient) =>
		({ emailAddress }: UserEmailAddress) =>
			exists(pg)({
				table: "users",
				value: emailAddress,
				column: "email_address",
			})