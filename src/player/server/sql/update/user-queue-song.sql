UPDATE
  {{ tableName }}
SET
  index = index {{ addSubtract }} 1
WHERE
  index = {{ index }} AND
  user_id = '{{ userID }}';