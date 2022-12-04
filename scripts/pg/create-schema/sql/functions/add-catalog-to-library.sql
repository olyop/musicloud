CREATE OR REPLACE FUNCTION
	add_catalog_to_library
	(user_id_arg uuid)
RETURNS
	void
LANGUAGE
	plpgsql
STABLE
AS $$ BEGIN
	PERFORM add_catalog_songs_to_library(user_id_arg);
	PERFORM add_catalog_artists_to_library(user_id_arg);
END $$;