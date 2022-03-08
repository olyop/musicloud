import { exists, PoolOrClient } from "@oly_op/pg-helpers"
import { UserEmailAddress } from "@oly_op/musicloud-common"

export const emailAddressExists =
	(pg: PoolOrClient) =>
		({ emailAddress }: UserEmailAddress) =>
			exists(pg)({
				table: "users",
				value: emailAddress,
				column: "email_address",
			})