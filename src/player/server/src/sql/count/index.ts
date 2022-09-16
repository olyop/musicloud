import importSql from "../import-sql"

const importFile = importSql("count")()

export const COUNT_PLAYS = importFile("plays")