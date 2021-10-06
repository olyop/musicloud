SELECT EXISTS (
	SELECT
		*
	FROM
		songs
	WHERE
		album_id = '{{ albumID }}' AND
		disc_number = {{ discNumber }} AND
		track_number = {{ trackNumber }}
);