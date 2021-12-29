CREATE TABLE IF NOT EXISTS library_songs (
	user_id uuid,
	song_id uuid,
	in_library boolean NOT NULL,
	date_added bigint NOT NULL DEFAULT get_now(),
	CONSTRAINT library_songs_pk
		PRIMARY KEY (user_id, song_id),
	CONSTRAINT library_songs_fk_song_id
		FOREIGN KEY (song_id)
		REFERENCES songs (song_id) MATCH FULL
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT library_songs_fk_user_id
		FOREIGN KEY (user_id)
		REFERENCES users (user_id) MATCH FULL
		ON UPDATE CASCADE
		ON DELETE CASCADE
);