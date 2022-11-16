CREATE OR REPLACE FUNCTION add_catalog_to_library(uuid)
RETURNS bigint AS BEGIN
	DECLARE @catalog_songs 
	SELECT song_id FROM songs ORDER BY title ASC;
END;