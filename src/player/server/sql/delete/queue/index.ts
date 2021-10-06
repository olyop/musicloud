import importSQL from "../../import-sql"

const importFile = importSQL("delete")("queue")

export const DELETE_QUEUE_SONG = importFile("song")
export const DELETE_QUEUE_BY_USER = importFile("by-user")