CREATE TABLE IF NOT EXISTS genres (
	genre_id uuid,
	name text NOT NULL,
	CONSTRAINT genres_pk
		PRIMARY KEY (genre_id)
);