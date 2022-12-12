CREATE OR REPLACE FUNCTION
	add_song_to_playlist
	(song_id_arg uuid, playlist_id_arg uuid)
RETURNS
	void
LANGUAGE
	plpgsql
VOLATILE
AS $$
	DECLARE
		last_playlist_song_index smallint;
		insert_playlist_song_index smallint;
	BEGIN
		IF NOT (is_song_in_playlist(song_id_arg, playlist_id_arg)) THEN
			SELECT
				playlists_songs.index INTO last_playlist_song_index
			FROM
				playlists_songs
			WHERE
				playlist_id = playlist_id_arg
			ORDER BY
				index DESC
			LIMIT
				1;

			IF (last_playlist_song_index IS NULL) THEN
				insert_playlist_song_index := 0;
			ELSE
				insert_playlist_song_index := last_playlist_song_index + 1;
			END IF;

			INSERT INTO playlists_songs
				(index, song_id, playlist_id)
			VALUES
				(insert_playlist_song_index, song_id_arg, playlist_id_arg);
		END IF;
	END
$$;
