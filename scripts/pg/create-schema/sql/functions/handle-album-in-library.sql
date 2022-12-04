CREATE OR REPLACE FUNCTION
	handle_album_in_library
	(user_id_arg uuid, album_id_arg uuid, in_library_arg boolean)
RETURNS
	void
LANGUAGE
	plpgsql
STABLE
AS $$
	DECLARE
		album_song record;
	BEGIN
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
			PERFORM handle_song_in_library(user_id_arg, album_song.song_id, in_library_arg);
		END LOOP;
	END
$$;
