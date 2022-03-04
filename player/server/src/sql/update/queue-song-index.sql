UPDATE
  {{ tableName }}
SET
  index = {{ newIndex }}
WHERE
  index = {{ index }} AND
  user_id = '{{ userID }}';