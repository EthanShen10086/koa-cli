const bcrypt = require('bcrypt');
class CryptUtils {
	static encrypt(val) {
		return bcrypt.hashSync(val, 10);
	}
	static decrypt(value, encryptedValue) {
		return bcrypt.compareSync(value, encryptedValue);
	}
}
module.exports = CryptUtils;
