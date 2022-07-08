SELECT
	count(*)
FROM
	library_songs
WHERE
	in_library = true AND
	user_id = '{{ userID }}';