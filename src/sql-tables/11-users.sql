CREATE TABLE IF NOT EXISTS users (
	user_id uuid,
	now_playing uuid,
	name text NOT NULL,
	password text NOT NULL,
	date_joined bigint NOT NULL DEFAULT cast(extract(epoch from now()) as bigint),
	CONSTRAINT users_pk
		PRIMARY KEY (user_id),
	CONSTRAINT users_fk_now_playing
		FOREIGN KEY (now_playing)
		REFERENCES songs (song_id) MATCH FULL
		ON UPDATE CASCADE
		ON DELETE CASCADE
);