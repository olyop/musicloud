CREATE OR REPLACE FUNCTION
	add_catalog_songs_to_library
	(user_id_arg uuid)
RETURNS
	void
LANGUAGE
	plpgsql
STABLE
AS $$
	DECLARE
		song record;
	BEGIN
		FOR song IN
			SELECT
				song_id
			FROM
				songs
		LOOP
			PERFORM handle_song_in_library(user_id_arg, song.song_id, false);
		END LOOP;
	END
$$;