import importSQL from "../../import-sql"

const importFile = importSQL("delete")("user")

export const DELETE_USER_BY_ID = importFile("by-id")
export const DELETE_USER_FOLLOWER = importFile("follower")
export const DELETE_USER_PLAYLISTS = importFile("playlists")