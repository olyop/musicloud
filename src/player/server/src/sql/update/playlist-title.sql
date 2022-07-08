UPDATE
  playlists
SET
  title = {{ title }}
WHERE
  playlist_id = '{{ playlistID }}'
RETURNING
	{{ columnNames }};