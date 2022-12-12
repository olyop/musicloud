CREATE OR REPLACE FUNCTION
	shuffle_artist
	(user_id_arg uuid, artist_id_arg uuid)
RETURNS
	void
LANGUAGE
	plpgsql
VOLATILE
AS $$
	DECLARE
		iterator integer;
		artist_song record;
	BEGIN
		PERFORM clear_queues(user_id_arg);

		FOR artist_song IN
			SELECT
				songs.song_id
			FROM
				get_artist_song_ids(artist_id_arg) AS artist_songs_ids
			JOIN
				songs
					ON artist_songs_ids.song_id = songs.song_id
			ORDER BY
				gen_random_uuid()
		LOOP
			IF (iterator IS NULL) THEN
				PERFORM handle_now_playing(user_id_arg, artist_song.song_id);
				iterator := 0;
			ELSE
				INSERT INTO queue_laters
					(index, user_id, song_id)
				VALUES
					(iterator, user_id_arg, artist_song.song_id);
				iterator := iterator + 1;
			END IF;
		END LOOP;
	END
$$;
