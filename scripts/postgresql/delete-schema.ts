import fs from "fs";
import path from "path";
import { Pool } from "pg";
import { PG_POOL_OPTIONS } from "@oly_op/musicloud-common/build/server-options";

const DELETE_SCHEMA = fs
	.readFileSync(path.join(process.cwd(), "src", "sql", "admin", "delete-schema.sql"))
	.toString();

const pool = new Pool(PG_POOL_OPTIONS);

await pool.query(DELETE_SCHEMA);
