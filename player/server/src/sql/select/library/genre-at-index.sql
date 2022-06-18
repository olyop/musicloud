SELECT
	{{ columnNames }}
FROM
	genres
WHERE
	genre_id in(
		SELECT
			genres.genre_id
		FROM
			library_genrs
		JOIN
			genres
				ON library_genres.genre_id = genres.genre_id
		WHERE
			in_library = true AND
			user_id = '{{ userID }}'
		ORDER BY
			{{ orderByField }} {{ orderByDirection }}
		LIMIT
			1
		OFFSET
			{{ atIndex }}
	);