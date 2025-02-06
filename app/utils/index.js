const { Base64 } = require('js-base64');
const { v4: uuidv4 } = require('uuid');

class CommonUtils {
	static isFileBase64(fileSrc) {
		return fileSrc && fileSrc.startsWith('data:image/jpeg;base64');
	}

	static getUuid() {
		return uuidv4();
	}

	// base64 加密
	static base64Encode(value) {
		return Base64.encode(value);
	}

	// base64 解密
	static base64Decode(value) {
		return Base64.decode(value);
	}

	// base64 解密
	static base64DataToImage(base64Data) {
		return 'data:image/png;base64,' + base64Data;
	}
	static isEmpty(obj) {
		if (obj === null || obj === undefined) {
			return false;
		}
		if (typeof obj === 'string') {
			return obj.trim().length > 0;
		}
		if (obj instanceof Array) {
			return obj.length > 0;
		}
		if (typeof obj === 'function') {
			return true;
		}
		if (obj instanceof Map || obj instanceof Set) {
			return obj.size > 0;
		}
		if (typeof obj === 'object') {
			for (const key of Object.keys(obj)) {
				// for (const key in obj) {
				return true;
			}
			return false;
		}
		return true;
	}

	static dataToString(obj) {
		return JSON.stringify(JSON.parse(obj));
	}
}

module.exports = CommonUtils;
