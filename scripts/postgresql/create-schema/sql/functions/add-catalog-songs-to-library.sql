CREATE OR REPLACE FUNCTION
	add_catalog_to_library
	(user_id_arg uuid)
RETURNS
	void
LANGUAGE
	plpgsql
STABLE
AS $$
	DECLARE
		album_song record;
		in_library boolean DEFAULT false;
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
			IF (song_is_in_library(user_id_arg, album_song.song_id)) THEN
				in_library = true;
			END IF;
		END LOOP;

		RETURN in_library;
	END
$$;