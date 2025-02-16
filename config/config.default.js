'use strict';
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Logger = require('../app/utils/Logger');
const ErrorCodeMap = require('../app/common/constant/errorCode');

// 加载环境变量
// 根据 NODE_ENV 加载不同的 .env 文件
if (process.env.NODE_ENV === 'production') {
	dotenv.config({ path: '.env.prod' });
} else {
	dotenv.config({ path: '.env' });
}

module.exports = (app) => {
	const {
		APP_HOST = 'localhost',
		APP_PORT = 3000,
		MYSQL_HOST = 'localhost',
		MYSQL_PORT = 3306,
		MYSQL_DATABASE,
		MYSQL_USER,
		MYSQL_PASSWORD,
	} = process.env;

	const config = {};

	// 组件配置
	config.componentID = 'yyh';
	// 前端应用服务
	config.contextPath = '/yyh-app';
	// 静态资源
	config.static = {
		// 7 天
		cacheTime: 7 * 24 * 60 * 60 * 1000,
		adminStaticPath: path.resolve(__dirname, '../static/admin'),
		appStaticPath: path.resolve(__dirname, '../static/app'),
		webStaticPath: path.resolve(__dirname, '../static/web'),
		businessUploadFile: path.resolve(
			__dirname,
			'../app/common/business/upload/file',
		),
		businessUploadImg: path.resolve(
			__dirname,
			'../app/common/business/upload/img',
		),
		outputFile: path.resolve(__dirname, '../public'),
	};
	if (app) {
		// cookie安全字符串
		config.keys = `${app.name}_12345`;
		// config.keys = `${app.name}_${process.env.APP_SECRET || 'default_secret'}`;
	}
	// 应用基础配置
	config.app = {
		host: APP_HOST,
		port: APP_PORT,
		// 后端接口服务
		adminAPI: `${config.contextPath}/api/admin`,
		webAPI: `${config.contextPath}/api/web`,
		appAPI: `${config.contextPath}/api/app`,
		commonAPI: `${config.contextPath}/api/common`,
	};

	// 数据库配置
	config.mysql = {
		host: MYSQL_HOST,
		port: MYSQL_PORT,
		database: MYSQL_DATABASE,
		user: MYSQL_USER,
		password: MYSQL_PASSWORD,
	};

	// 密钥配置;
	try {
		// const keysDir = path.resolve(__dirname, './keys');
		// // 确保密钥目录存在
		// if (!fs.existsSync(keysDir)) {
		// 	fs.mkdirSync(keysDir, { recursive: true });
		// }

		// const privateKeyPath = path.join(keysDir, 'private.key');
		// const publicKeyPath = path.join(keysDir, 'public.key');

		// // 如果任一密钥文件不存在则生成新密钥对
		// if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
		// 	const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
		// 		modulusLength: 2048,
		// 		publicKeyEncoding: {
		// 			type: 'spki',
		// 			format: 'pem',
		// 		},
		// 		privateKeyEncoding: {
		// 			type: 'pkcs8',
		// 			format: 'pem',
		// 		},
		// 	});
		// 	fs.writeFileSync(privateKeyPath, privateKey);
		// 	fs.writeFileSync(publicKeyPath, publicKey);
		// }

		// const PRIVATE_KEY = fs.readFileSync(privateKeyPath);
		// const PUBLIC_KEY = fs.readFileSync(publicKeyPath);
		const PRIVATE_KEY = fs.readFileSync(
			path.resolve(__dirname, './keys/private.key'),
		);
		const PUBLIC_KEY = fs.readFileSync(
			path.resolve(__dirname, './keys/public.key'),
		);
		config.jwt = {
			PRIVATE_KEY,
			PUBLIC_KEY,
			cacheTime: 7 * 24 * 60 * 60,
		};
	} catch (err) {
		Logger.error(err, ErrorCodeMap.ERROR_JWT_INIT);
		config.jwt = {
			PRIVATE_KEY: '',
			PUBLIC_KEY: '',
			cacheTime: 7 * 24 * 60 * 60,
		};
	}

	return config;
};
