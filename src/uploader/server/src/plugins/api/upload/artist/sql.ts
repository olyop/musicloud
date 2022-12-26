import { importSQL } from "@oly_op/pg-helpers";

export const INSERT_ARTIST = await importSQL(import.meta.url)("insert-artist");
