UPDATE
  users
SET
  password = {{ password }}
WHERE
  user_id = {{ userID }};