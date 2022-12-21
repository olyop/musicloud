CREATE OR REPLACE FUNCTION
	play_playlist
	(user_id_arg uuid, playlist_id_arg uuid)
RETURNS
	void
LANGUAGE
	plpgsql
VOLATILE
AS $$
	DECLARE
		iterator integer;
		playlist_song record;
	BEGIN
		PERFORM clear_queues(user_id_arg);

		FOR playlist_song IN
			SELECT
				songs.song_id
			FROM
				playlists_songs
			JOIN
				songs
					ON playlists_songs.song_id = songs.song_id
			WHERE
				playlist_id = playlist_id_arg
			ORDER BY
				index ASC
		LOOP
			IF (iterator IS NULL) THEN
				PERFORM handle_now_playing(user_id_arg, playlist_song.song_id);
				iterator := 0;
			ELSE
				INSERT INTO queue_laters
					(index, user_id, song_id)
				VALUES
					(iterator, user_id_arg, playlist_song.song_id);
				iterator := iterator + 1;
			END IF;
		END LOOP;
	END
$$;
