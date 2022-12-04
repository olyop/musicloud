CREATE TABLE IF NOT EXISTS genres (
	name text NOT NULL,
	genre_id uuid DEFAULT gen_random_uuid(),
	CONSTRAINT genres_pk
		PRIMARY KEY (genre_id)
);