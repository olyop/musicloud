SELECT
  genre_id
FROM
  songs_genres
WHERE
  song_id = {{ songID }};