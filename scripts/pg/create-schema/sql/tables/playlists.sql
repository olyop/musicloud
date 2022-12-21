CREATE TABLE IF NOT EXISTS playlists (
	title text NOT NULL,
	user_id uuid NOT NULL,
	privacy playlist_privacy NOT NULL,
	playlist_id uuid DEFAULT gen_random_uuid(),
	date_created bigint NOT NULL DEFAULT get_now(),
	CONSTRAINT playlists_pk
		PRIMARY KEY (playlist_id),
	CONSTRAINT playlists_fk_user_id
		FOREIGN KEY (user_id)
		REFERENCES users (user_id) MATCH FULL
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT playlists_check_date_created
		CHECK (date_created <= get_now())
);