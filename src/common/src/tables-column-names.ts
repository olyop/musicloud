const NAME = "name";
const TITLE = "title";

// prettier-ignore
const GENRE = [
	"genre_id",
	NAME,
] as const;

// prettier-ignore
const ARTIST = [
	"artist_id",
	NAME,
	"city",
	"country",
] as const;

// prettier-ignore
const PLAY = [
	"play_id",
	"date_created",
] as const;

// prettier-ignore
const ALBUM = [
	"album_id",
	TITLE,
	"released",
] as const;

// prettier-ignore
const KEY = [
	"key_id",
	"flat",
	"sharp",
	"camelot",
] as const;

// prettier-ignore
const SONG = [
	"song_id",
	"mix",
	"bpm",
	KEY[0],
	TITLE,
	ALBUM[0],
	"duration",
	"disc_number",
	"track_number",
] as const;

// prettier-ignore
const USER = [
	"user_id",
	NAME,
	"date_joined",
	"email_address",
] as const;

// prettier-ignore
const USER_FOLLOWERS = [
	USER[0],
	"follower_user_id",
	"date_followed",
] as const;

// prettier-ignore
const PLAYLIST = [
	"playlist_id",
	TITLE,
	USER[0],
	"privacy",
	"date_created",
] as const;

// prettier-ignore
const QUEUE_SONG = [
	"index",
	USER[0],
	SONG[0],
] as const;

// prettier-ignore
const PLAYLIST_SONG = [
	"index",
	SONG[0],
	PLAYLIST[0],
	"date_added",
] as const;

// prettier-ignore
const NOW_PLAYING = [
	USER[0],
	SONG[0],
] as const;

// prettier-ignore
export const COLUMN_NAMES = {
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
};
