const { Base64 } = require('js-base64');
const { v4: uuidv4 } = require('uuid');
const Logger = require('./Logger');
const SnowflakeIdGenerator = require('./Snowflake');

class CommonUtils {
	static snowFlakeGenerator = new SnowflakeIdGenerator(1);
	static defaultWhiteList = [];
	static defaultBlackList = ['password'];

	static isFileBase64(fileSrc) {
		return fileSrc && fileSrc.startsWith('data:image/jpeg;base64');
	}

	static getUuid() {
		// UUID V1: 通过时间戳和MAC地址来生成，可以生成顺序的UUID。
		// UUID V4: 通过随机数来生成，无法生成顺序的UUID。
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
	static notEmpty(obj) {
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
		try {
			// 如果 obj 是字符串，尝试解析为 JSON
			if (typeof obj === 'string') {
				return JSON.stringify(JSON.parse(obj));
			}
			// 如果 obj 是对象，直接转换为 JSON 字符串
			return JSON.stringify(obj);
		} catch (error) {
			Logger.error(error);
			// 如果解析失败，返回对象的字符串表示
			return obj.toString();
		}
	}
	// 将list中 item 敏感字段进行屏蔽
	// 在()里如果直接用this会丢失ctx导致报错

	static filterSensitiveFields(item, blackList = CommonUtils.defaultBlackList) {
		const filtered = {};
		Object.keys(item).forEach((key) => {
			if (!blackList.includes(key)) {
				filtered[key] = item[key];
			}
		});
		return filtered;
	}

	// 只展示whiteList里面的字段
	static getWhiteListFields(item, whiteList = CommonUtils.defaultWhiteList) {
		const filtered = {};
		whiteList.forEach((field) => {
			if (item[field] !== undefined) {
				filtered[field] = item[field];
			}
		});
		return filtered;
	}

	// 将item中敏感信息加密
	static sentitiveFields(data) {
		if (data.email) {
			const [name, domain] = data.email.split('@');
			data.email = `${name[0]}***${name.slice(-1)}@${domain}`;
		}
		if (data.phone) {
			data.phone = data.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
		}
		return data;
	}

	// 1228935168\u0000\u0000\u0000\u0000\u0000\u0000
	// buffer用toString() 默认 utf8 编码的
	static snowflakeIdToId(snowflakeId) {
		return snowflakeId instanceof Buffer
			? snowflakeId.toString().replace(/\0/g, '')
			: snowflakeId;
	}

	static idToSnowflakeId(snowflakeId) {
		const str =
			snowflakeId instanceof Buffer
				? snowflakeId.toString('utf8').replace(/\0/g, '')
				: String(snowflakeId);
		return BigInt(str);
	}
}

module.exports = CommonUtils;
