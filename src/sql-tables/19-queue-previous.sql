CREATE TABLE IF NOT EXISTS queue_previous (
  user_id uuid,
  song_id uuid,
  index smallint,
  CONSTRAINT queue_previous_pk
    PRIMARY KEY (user_id, song_id, index),
  CONSTRAINT queue_previous_fk_song_id
    FOREIGN KEY (song_id)
    REFERENCES songs (song_id) MATCH FULL
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT queue_previous_fk_user_id
    FOREIGN KEY (user_id)
    REFERENCES users (user_id) MATCH FULL
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT queue_previous_check_index
    CHECK (index >= 0)
);