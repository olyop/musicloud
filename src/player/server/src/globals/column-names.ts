const GENRE = ["genre_id", "name"] as const;

const ARTIST = ["artist_id", "name", "city", "country"] as const;

const PLAY = ["play_id", "date_created"] as const;

const ALBUM = ["album_id", "title", "released"] as const;

const KEY = ["key_id", "flat", "sharp", "camelot"] as const;

const SONG = [
	"song_id",
	"mix",
	"bpm",
	KEY[0],
	"title",
	ALBUM[0],
	"duration",
	"disc_number",
	"track_number",
] as const;

const USER = ["user_id", "name", "date_joined", "email_address"] as const;

const USER_FOLLOWERS = [USER[0], "follower_user_id", "date_followed"] as const;

const PLAYLIST = ["playlist_id", "title", USER[0], "privacy", "date_created"] as const;

const QUEUE_SONG = ["index", USER[0], SONG[0]] as const;

const PLAYLIST_SONG = ["index", SONG[0], PLAYLIST[0], "date_added"] as const;

const NOW_PLAYING = [USER[0], SONG[0]] as const;

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
};

export default COLUMN_NAMES;
