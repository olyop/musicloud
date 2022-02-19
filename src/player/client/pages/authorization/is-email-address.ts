import isNull from "lodash-es/isNull"

const isEmailAddress =
	(value: string) =>
		// eslint-disable-next-line max-len
		!isNull(value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/))

export default isEmailAddress