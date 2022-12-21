CREATE TABLE IF NOT EXISTS plays (
	user_id uuid,
	song_id uuid NOT NULL,
	play_id uuid DEFAULT gen_random_uuid(),
	date_created bigint NOT NULL DEFAULT get_now(),
	CONSTRAINT plays_pk
		PRIMARY KEY (play_id),
	CONSTRAINT plays_fk_song_id
		FOREIGN KEY (song_id)
		REFERENCES songs (song_id) MATCH SIMPLE
		ON UPDATE CASCADE
		ON DELETE SET NULL,
	CONSTRAINT plays_fk_user_id
		FOREIGN KEY (user_id)
		REFERENCES users (user_id) MATCH SIMPLE
		ON UPDATE CASCADE
		ON DELETE SET NULL,
	CONSTRAINT plays_check_date_created
		CHECK (date_created <= get_now())
);