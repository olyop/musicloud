import { Pool } from "pg";
import { PG_POOL_OPTIONS } from "@oly_op/musicloud-common";

const pg = new Pool(PG_POOL_OPTIONS);

export default pg;
