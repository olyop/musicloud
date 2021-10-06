INSERT INTO users (
	name,
	email,
	user_id
) VALUES (
	'Oliver',
	'oliver.plummer@outlook.com',
	''
) RETURNING
	name,
	email,
	user_id,
	nowPlaying,
	date_joined;