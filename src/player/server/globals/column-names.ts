const GENRE: [
	"genre_id",
	"name",
] = [
	"genre_id",
	"name",
]

const ARTIST: [
	"artist_id",
	"name",
	"city",
	"country",
] = [
	"artist_id",
	"name",
	"city",
	"country",
]

const PLAY: [
	"play_id",
	"date_created",
] = [
	"play_id",
	"date_created",
]

const ALBUM: [
	"album_id",
	"title",
	"released",
] = [
	"album_id",
	"title",
	"released",
]

const KEY: [
	"key_id",
	"flat",
	"sharp",
	"camelot",
] = [
	"key_id",
	"flat",
	"sharp",
	"camelot",
]

const SONG: [
	"song_id",
	"mix",
	"bpm",
	typeof KEY[0],
	"title",
	typeof ALBUM[0],
	"duration",
	"disc_number",
	"track_number",
] = [
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

const USER: [
	"user_id",
	"name",
	"date_joined",
] = [
	"user_id",
	"name",
	"date_joined",
]

const USER_FOLLOWERS: [
	typeof USER[0],
	"follower_user_id",
	"date_followed",
] = [
	USER[0],
	"follower_user_id",
	"date_followed",
]

const PLAYLIST: [
	"playlist_id",
	"title",
	typeof USER[0],
	"privacy",
	"date_created",
] = [
	"playlist_id",
	"title",
	USER[0],
	"privacy",
	"date_created",
]

const QUEUE_SONG: [
	"index",
	typeof USER[0],
	typeof SONG[0],
] = [
	"index",
	USER[0],
	SONG[0],
]

const PLAYLIST_SONG: [
	"index",
	typeof SONG[0],
	typeof PLAYLIST[0],
	"date_added",
] = [
	"index",
	SONG[0],
	PLAYLIST[0],
	"date_added",
]

const NOW_PLAYING: [
	typeof USER[0],
	typeof SONG[0],
] = [
	USER[0],
	SONG[0],
]

const COLUMN_NAMES = {
	KEY,
	PLAY,
	SONG,
	USER,
	ALBUM,
	GENRE,
	ARTIST,
	PLAYLIST,
	QUEUE_SONG,
	NOW_PLAYING,
	PLAYLIST_SONG,
	USER_FOLLOWERS,
}

export default COLUMN_NAMES