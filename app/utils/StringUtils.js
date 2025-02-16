class StringUtils {
	static capitalize(data) {
		return data.charAt(0).toUpperCase() + data.slice(1);
	}
}
module.exports = StringUtils;
