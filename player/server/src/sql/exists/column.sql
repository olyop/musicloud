SELECT EXISTS (
	SELECT
		*
	FROM
		{{ table }}
	WHERE
		{{ column }} = {{ value }}
);