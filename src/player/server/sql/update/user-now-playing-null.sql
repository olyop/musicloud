UPDATE
  users
SET
  now_playing = NULL
WHERE
  user_id = '{{ userID }}';