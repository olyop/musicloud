CREATE TABLE IF NOT EXISTS playlists_songs (
	song_id uuid,
	index smallint,
	playlist_id uuid,
	date_added bigint NOT NULL DEFAULT cast(extract(epoch from now()) as bigint),
	CONSTRAINT playlists_songs_pk
		PRIMARY KEY (playlist_id, song_id),
  CONSTRAINT playlists_songs_check_index
    CHECK (index >= 0),
	CONSTRAINT playlists_songs_fk_playlist_id
		FOREIGN KEY (playlist_id)
		REFERENCES playlists (playlist_id) MATCH FULL
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT playlists_songs_fk_song_id
		FOREIGN KEY (song_id)
		REFERENCES songs (song_id) MATCH FULL
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT playlists_songs_check_date_added
		CHECK (date_added <= cast(extract(epoch from now()) as bigint))
);