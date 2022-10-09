import importSQL from "../../import-sql";

const importFile = importSQL("select")("key");

export const SELECT_KEY_BY_ID = importFile("by-id");
