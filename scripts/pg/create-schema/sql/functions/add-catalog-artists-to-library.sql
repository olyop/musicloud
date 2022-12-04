CREATE OR REPLACE FUNCTION
	add_catalog_artists_to_library
	(user_id_arg uuid)
RETURNS
	void
LANGUAGE
	plpgsql
STABLE
AS $$
	DECLARE
		artist record;
	BEGIN
		FOR artist IN
			SELECT
				artist_id
			FROM
				artists
		LOOP
			PERFORM handle_artist_in_library(user_id_arg, artist.artist_id, false);
		END LOOP;
	END
$$;