SELECT
	count(*)
FROM (
	SELECT
		song_id
	FROM
		songs_artists
	WHERE
		artist_id = {{ artistID }}
	UNION
	SELECT
		song_id
	FROM
		songs_remixers
	WHERE
		artist_id = {{ artistID }}
	UNION
	SELECT
		song_id
	FROM
		songs_featurings
	WHERE
		artist_id = {{ artistID }}
) AS artist_songs_ids;