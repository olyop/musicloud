SELECT EXISTS (
	SELECT
		*
	FROM
		songs
	WHERE
		song_id = '{{ songID }}'
);