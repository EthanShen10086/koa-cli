'use strict';
const dotenv = require('dotenv');
// const fs = require('fs');
// const path = require('path');

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
		adminAPI: `${config.contextPath}/admin/api`,
		webAPI: `${config.contextPath}/web/api`,
		appAPI: `${config.contextPath}/app/api`,
		commonAPI: `${config.contextPath}/common/api`,
	};

	// 数据库配置
	config.mysql = {
		host: MYSQL_HOST,
		port: MYSQL_PORT,
		database: MYSQL_DATABASE,
		user: MYSQL_USER,
		password: MYSQL_PASSWORD,
	};

	// 密钥配置
	// try {
	// 	config.jwt = {
	// 		privateKey: fs.readFileSync(
	// 			path.resolve(__dirname, './keys/private.key'),
	// 		),
	// 		publicKey: fs.readFileSync(path.resolve(__dirname, './keys/public.key')),
	// 	};
	// } catch (err) {
	// 	console.warn(
	// 		err,
	// 		'Warning: JWT keys not found. Please ensure keys are properly configured.',
	// 	);
	// 	config.jwt = {
	// 		privateKey: '',
	// 		publicKey: '',
	// 	};
	// }

	return config;
};
