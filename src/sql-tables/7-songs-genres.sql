CREATE TABLE IF NOT EXISTS songs_genres (
  song_id uuid,
  genre_id uuid,
  index smallint,
  CONSTRAINT songs_genres_pk
    PRIMARY KEY (song_id, genre_id, index),
  CONSTRAINT songs_genres_fk_genre_id
    FOREIGN KEY (genre_id)
    REFERENCES genres (genre_id) MATCH FULL
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT songs_genres_fk_song_id
    FOREIGN KEY (song_id)
    REFERENCES songs (song_id) MATCH FULL
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT songs_genres_check_index
    CHECK (index >= 0)
);