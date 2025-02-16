const bcrypt = require('bcrypt');
class CryptUtils {
	static encrypt(val) {
		return bcrypt.hash(val, 10);
	}
	static decrypt(value, encryptedValue) {
		return bcrypt.compare(value, encryptedValue);
	}
}
module.exports = CryptUtils;
