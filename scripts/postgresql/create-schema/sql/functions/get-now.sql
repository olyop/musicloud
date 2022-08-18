CREATE FUNCTION
	get_now()
RETURNS
	bigint
LANGUAGE
	'sql'
STABLE AS $$
	SELECT
		cast(extract(epoch from now()) as bigint)
$$;