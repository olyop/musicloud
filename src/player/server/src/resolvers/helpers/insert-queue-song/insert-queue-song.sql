INSERT INTO {{ tableName }} (
	index,
	user_id,
	song_id
) VALUES (
	{{ index }},
	{{ userID }},
	{{ songID }}
);