CREATE TABLE IF NOT EXISTS library_playlists (
	user_id uuid,
	playlist_id uuid,
	date_added bigint NOT NULL DEFAULT get_now(),
	CONSTRAINT library_playlists_pk
		PRIMARY KEY (user_id, playlist_id),
	CONSTRAINT library_playlists_fk_playlist_id
		FOREIGN KEY (playlist_id)
		REFERENCES playlists (playlist_id) MATCH FULL
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT library_playlists_fk_user_id
		FOREIGN KEY (user_id)
		REFERENCES users (user_id) MATCH FULL
		ON UPDATE CASCADE
		ON DELETE CASCADE
);