CREATE TABLE IF NOT EXISTS now_playing (
	user_id uuid,
	song_id uuid,
	CONSTRAINT now_playing_pk
		PRIMARY KEY (user_id, song_id),
	CONSTRAINT now_playing_fk_user_id
		FOREIGN KEY (user_id)
		REFERENCES users (user_id) MATCH FULL
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT now_playing_fk_song_id
		FOREIGN KEY (song_id)
		REFERENCES songs (song_id) MATCH FULL
		ON UPDATE CASCADE
		ON DELETE CASCADE
);