CREATE OR REPLACE FUNCTION
	remove_song_from_playlist
	(index_arg integer, playlist_id_arg uuid)
RETURNS
	void
LANGUAGE
	plpgsql
	VOLATILE
AS $$
	DECLARE
		playlist_song record;
	BEGIN
		IF (is_index_in_playlist(index_arg, playlist_id_arg)) THEN
			DELETE FROM
				playlists_songs
			WHERE
				index = index_arg AND
				playlist_id = playlist_id_arg;

			FOR playlist_song IN
				SELECT
					index,
					playlist_id
				FROM
					playlists_songs
				WHERE
					index > index_arg AND
					playlist_id = playlist_id_arg
				ORDER BY
					index ASC
			LOOP
				UPDATE
					playlists_songs
				SET
					index = index - 1
				WHERE
					index = playlist_song.index AND
					playlist_id = playlist_id_arg;
			END LOOP;
		END IF;
	END
$$;
