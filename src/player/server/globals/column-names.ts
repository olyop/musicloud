export const GENRE = [
	"genre_id",
	"name",
]

export const ARTIST = [
	"artist_id",
	"name",
	"city",
	"country",
]

export const PLAY = [
	"play_id",
	"date_created",
]

export const ALBUM = [
	"album_id",
	"title",
	"released",
]

export const KEY = [
	"key_id",
	"flat",
	"sharp",
	"camelot",
]

export const SONG = [
	"song_id",
	"mix",
	"bpm",
	KEY[0],
	"title",
	ALBUM[0],
	"duration",
	"disc_number",
	"track_number",
]

export const USER = [
	"user_id",
	"name",
	"date_joined",
]

export const PLAYLIST = [
	"playlist_id",
	"title",
	USER[0],
	"date_created",
]

export const QUEUE_SONG = [
	"index",
	USER[0],
	SONG[0],
]

export const PLAYLIST_SONG = [
	"index",
	SONG[0],
	PLAYLIST[0],
	"date_added",
]

export const NOW_PLAYING = [
	USER[0],
	SONG[0],
]