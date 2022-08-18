CREATE TABLE IF NOT EXISTS library_artists (
	user_id uuid,
	artist_id uuid,
	in_library boolean NOT NULL,
	date_added bigint NOT NULL DEFAULT get_now(),
	CONSTRAINT library_artists_pk
		PRIMARY KEY (user_id, artist_id),
	CONSTRAINT library_artists_fk_artist_id
		FOREIGN KEY (artist_id)
		REFERENCES artists (artist_id) MATCH FULL
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT library_artists_fk_user_id
		FOREIGN KEY (user_id)
		REFERENCES users (user_id) MATCH FULL
		ON UPDATE CASCADE
		ON DELETE CASCADE
);