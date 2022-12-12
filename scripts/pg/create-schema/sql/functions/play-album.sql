CREATE OR REPLACE FUNCTION
	play_album
	(user_id_arg uuid, album_id uuid)
RETURNS
	void
LANGUAGE
	plpgsql
VOLATILE
AS $$
	DECLARE
		album_song record;
		iterator integer := 0;
	BEGIN
		PERFORM clear_queues(user_id_arg);

		FOR album_song IN
			SELECT
				song_id
			FROM
				songs
			WHERE
				album_id = album_id_arg
			ORDER BY
				disc_number ASC,
				track_number ASC
		LOOP
			IF (iterator = 0) THEN
				PERFORM handle_now_playing(user_id_arg, album_song.song_id);
			ELSE
				INSERT INTO queue_laters
					(index, user_id, song_id)
				VALUES
					(iterator, user_id_arg, album_song.song_id);
				iterator := iterator + 1;
			END IF;
		END LOOP;
	END
$$;
