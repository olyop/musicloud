UPDATE
  users
SET
  now_playing = '{{ songID }}'
WHERE
  user_id = '{{ userID }}'
RETURNING
	{{ columnNames }};