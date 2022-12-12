CREATE OR REPLACE FUNCTION
	shuffle_next
	(user_id_arg uuid)
RETURNS
	void
LANGUAGE
	plpgsql
VOLATILE
AS $$
	DECLARE
		queue_song record;
		iterator integer := 0;
	BEGIN
		FOR queue_song IN
			SELECT
				song_id
			FROM
				queue_nexts
			WHERE
				user_id = user_id_arg
			ORDER BY
				gen_random_uuid()
		LOOP
			UPDATE
				queue_nexts
			SET
				index = iterator
			WHERE
				user_id = user_id_arg AND
				song_id = queue_song.song_id;

			iterator := iterator + 1;
		END LOOP;
	END
$$;
