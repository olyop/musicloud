CREATE OR REPLACE FUNCTION
	get_top_song_ids
	(limit_arg integer DEFAULT 100)
RETURNS
	TABLE
		(song_id uuid, count bigint)
LANGUAGE
	plpgsql
STABLE
AS $$ BEGIN
	RETURN QUERY
		SELECT
			song_id
		FROM (
			SELECT
				songs.song_id,
				COUNT(plays.song_id) as sum
			FROM
				songs
			JOIN
				plays
					ON songs.song_id = plays.song_id
			GROUP BY
				songs.song_id
			ORDER BY
				sum DESC
			LIMIT
				limit_arg;
		)
END $$;
