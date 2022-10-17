CREATE FUNCTION get_now() RETURNS bigint
	LANGUAGE SQL
	STABLE AS $$
		SELECT cast(extract(epoch from now()) as bigint);
	$$;