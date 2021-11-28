SELECT DISTINCT
  {{ columnNames }}
FROM
  (
    SELECT DISTINCT
      album_id
    FROM
      (
        SELECT
          song_id
        FROM
          songs_artists
        WHERE
          artist_id = '{{ artistID }}'
        UNION
        SELECT
          song_id
        FROM
          songs_remixers
        WHERE
          artist_id = '{{ artistID }}'
        UNION
        SELECT
          song_id
        FROM
          songs_featurings
        WHERE
          artist_id = '{{ artistID }}'
      ) AS artist_songs_ids
    JOIN
      songs
        ON artist_songs_ids.song_id = songs.song_id
  ) AS artist_albums_ids
JOIN
   albums
    ON artist_albums_ids.album_id = albums.album_id;