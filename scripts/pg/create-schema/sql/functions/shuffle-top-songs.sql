CREATE OR REPLACE FUNCTION
	shuffle_top_songs
	(user_id_arg uuid, limit_arg integer)
RETURNS
	void
LANGUAGE
	plpgsql
VOLATILE
AS $$
	DECLARE
		iterator integer;
		top_song record;
	BEGIN
		PERFORM clear_queues(user_id_arg);

		FOR top_song IN
			SELECT
				song_id
			FROM
				get_top_song_ids(limit_arg)
			ORDER BY
				gen_random_uuid()
		LOOP
			IF (iterator IS NULL) THEN
				PERFORM handle_now_playing(user_id_arg, top_song.song_id);
				iterator := 0;
			ELSE
				INSERT INTO queue_laters
					(index, user_id, song_id)
				VALUES
					(iterator, user_id_arg, top_song.song_id);
				iterator := iterator + 1;
			END IF;
		END LOOP;
	END
$$;
