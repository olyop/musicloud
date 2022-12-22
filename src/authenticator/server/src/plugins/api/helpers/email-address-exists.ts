import { UserEmailAddressBase } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient, exists } from "@oly_op/pg-helpers";

export const emailAddressExists =
	(pg: PoolOrClient) =>
	({ emailAddress }: UserEmailAddressBase) =>
		exists(pg)({
			table: "users",
			value: emailAddress,
			column: "email_address",
		});
