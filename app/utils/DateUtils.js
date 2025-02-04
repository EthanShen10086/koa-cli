const dayjs = require('dayjs');
const defaultFormat = 'YYYY-MM-DD HH:mm:ss';

class DateUtils {
	static formatDateTime = (dateTime, fmt = defaultFormat) => {
		return dayjs(dateTime).format(fmt);
	};
}

module.exports = { DateUtils, dayjs };
