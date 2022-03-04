SELECT EXISTS (
	SELECT
		*
	FROM
		albums
	WHERE
		title = {{ title }} AND
		released = {{ released }}
);