CREATE OR REPLACE FUNCTION
	get_album_duration
	(album_id_arg uuid)
RETURNS
	boolean
LANGUAGE
	plpgsql
STABLE
AS $$
	DECLARE
		album_song record;
		duration smallint;
	BEGIN
		FOR album_song IN
			SELECT
				duration
			FROM
				songs
			WHERE
				album_id = album_id_arg
		LOOP
			duration = duration + album_song.duration;
		END LOOP;

		RETURN duration;
	END
$$;
