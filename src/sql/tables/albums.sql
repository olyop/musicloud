CREATE TABLE IF NOT EXISTS albums (
	title text NOT NULL,
	album_id uuid DEFAULT gen_random_uuid(),
	released date NOT NULL DEFAULT current_date,
	CONSTRAINT albums_pk
		PRIMARY KEY (album_id),
	CONSTRAINT albums_check_released
		CHECK (released <= current_date)
);