CREATE OR REPLACE FUNCTION
	add_some_plays
	(user_id_arg uuid)
RETURNS
	void
LANGUAGE
	plpgsql
VOLATILE
AS $$
	DECLARE
		iterator integer;
		iterator_inner integer;
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
			FOR iterator IN 1..(random() * 1000)::integer LOOP
				INSERT INTO plays
					(user_id, song_id)
				VALUES
					(user_id_arg, library_song.song_id);
			END LOOP;
		END LOOP;
	END
$$;
