UPDATE
  {{ tableName }}
SET
  in_library = {{ inLibrary }}
WHERE
  user_id = '{{ userID }}' AND
  {{ columnName }} = '{{ objectID }}';