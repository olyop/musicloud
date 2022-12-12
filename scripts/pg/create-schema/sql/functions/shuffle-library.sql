CREATE OR REPLACE FUNCTION
	shuffle_library
	(user_id_arg uuid)
RETURNS
	void
LANGUAGE
	plpgsql
VOLATILE
AS $$
	DECLARE
		iterator integer;
		library_song record;
	BEGIN
		PERFORM clear_queues(user_id_arg);

		FOR library_song IN
			SELECT
				library_songs.song_id
			FROM
				library_songs
			WHERE
				user_id = user_id_arg
			ORDER BY
				gen_random_uuid()
		LOOP
			IF (iterator IS NULL) THEN
				PERFORM handle_now_playing(user_id_arg, library_song.song_id);
				iterator := 0;
			ELSE
				INSERT INTO queue_laters
					(index, user_id, song_id)
				VALUES
					(iterator, user_id_arg, library_song.song_id);
				iterator := iterator + 1;
			END IF;
		END LOOP;
	END
$$;
