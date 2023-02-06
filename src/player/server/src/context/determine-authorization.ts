import { IncomingHttpHeaders } from "node:http";

import { IS_PRODUCTION } from "@oly_op/musicloud-common/build/globals";
import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { exists } from "@oly_op/pg-helpers";
import { isUndefined } from "lodash-es";
import { Pool } from "pg";

import { ContextAuthorization } from "./index.js";
import { verifyAccessToken } from "./verify-access-token.js";

export const determineAuthorization = async (
	authorization: IncomingHttpHeaders["authorization"],
	pool: Pool,
): Promise<ContextAuthorization> => {
	if (isUndefined(authorization)) {
		return false;
	}

	if (!authorization.startsWith("Bearer ")) {
		return false;
	}

	try {
		const token = authorization.slice(7);
		const payload = await verifyAccessToken(token);

		const userExists = IS_PRODUCTION
			? await exists(pool)({
					table: "users",
					value: payload.userID,
					column: COLUMN_NAMES.USER[0],
			  })
			: true;

		if (!userExists) {
			return false;
		}

		return payload;
	} catch {
		return false;
	}
};
