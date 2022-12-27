import { JWT_ALGORITHM } from "@oly_op/musicloud-common/build/globals";
import { JWTPayload } from "@oly_op/musicloud-common/build/types";
import { createVerifier } from "fast-jwt";

export const verifyAccessToken = createVerifier({
	algorithms: [JWT_ALGORITHM],
	key: () => Promise.resolve(process.env.JWT_TOKEN_SECRET),
}) as (token: string) => Promise<JWTPayload>;
