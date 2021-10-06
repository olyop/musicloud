export const GENRE = [
	"name",
	"genre_id",
]

export const ARTIST = [
	"name",
	"city",
	"country",
	"artist_id",
]

export const PLAY = [
	"play_id",
	"date_created",
]

export const ALBUM = [
	"title",
	"album_id",
	"released",
]

export const KEY = [
	"flat",
	"sharp",
	"key_id",
	"camelot",
]

export const SONG = [
	"mix",
	"bpm",
	"title",
	"key_id",
	"song_id",
	"album_id",
	"duration",
	"disc_number",
	"track_number",
]

export const PLAYLIST = [
	"title",
	"user_id",
	"playlist_id",
	"date_created",
]

export const USER = [
	"name",
	"user_id",
	"date_joined",
	"now_playing",
]

export const LIBRARY_SONG = [
	"user_id",
	"song_id",
	"in_library",
	"date_added",
]

export const LIBRARY_ALBUM = [
	"user_id",
	"album_id",
	"in_library",
	"date_added",
]

export const LIBRARY_GENRE = [
	"user_id",
	"genre_id",
	"in_library",
	"date_added",
]

export const LIBRARY_ARTIST = [
	"user_id",
	"artist_id",
	"in_library",
	"date_added",
]

export const QUEUE_SONG = [
	"index",
	"user_id",
	"song_id",
]

export const PLAYLIST_SONG = [
	"index",
	"song_id",
	"playlist_id",
]