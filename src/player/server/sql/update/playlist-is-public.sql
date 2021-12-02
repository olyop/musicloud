UPDATE
  playlists
SET
  is_public = {{ isPublic }}
WHERE
  playlist_id = '{{ playlistID }}'
RETURNING
	{{ columnNames }};