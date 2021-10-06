CREATE TABLE IF NOT EXISTS albums (
	album_id uuid,
	title text NOT NULL,
	released date NOT NULL DEFAULT current_date,
	CONSTRAINT albums_pk
		PRIMARY KEY (album_id),
	CONSTRAINT albums_check_released
		CHECK (released <= current_date)
);