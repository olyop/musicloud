import { UserBase, UserEmailAddressBase } from "@oly_op/musicloud-common/build/types";
import { convertFirstRowToCamelCase, join, PoolOrClient, query } from "@oly_op/pg-helpers";

import { SELECT_USER_BY_EMAIL } from "./sql";

const getUserFromEmailAddress =
	(pg: PoolOrClient) =>
	({ emailAddress }: UserEmailAddressBase) =>
		query(pg)(SELECT_USER_BY_EMAIL)({
			parse: convertFirstRowToCamelCase<UserBase>(),
			variables: {
				emailAddress,
				columnNames: join(["name", "user_id", "date_joined", "email_address"]),
			},
		});

export default getUserFromEmailAddress;
