import { exists, PoolOrClient } from "@oly_op/pg-helpers";
import { UserEmailAddressBase } from "@oly_op/musicloud-common/build/types";

export const emailAddressExists =
	(pg: PoolOrClient) =>
	({ emailAddress }: UserEmailAddressBase) =>
		exists(pg)({
			table: "users",
			value: emailAddress,
			column: "email_address",
		});
