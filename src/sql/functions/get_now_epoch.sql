CREATE FUNCTION get_now_epoch()
	RETURNS bigint AS
		LANGUAGE SQL
		IMMUTABLE
		STRICT
		RETURN cast(extract(epoch from now()) as bigint);