'use strict';
// const isDEV = process.env.NODE_ENV === 'development';
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// 加载环境变量
dotenv.config();

module.exports = (app) => {
	const config = {};

	// 组件配置
	config.componentID = 'yyh';
	// 后端接口服务
	config.adminService = '/yyh-app/admin/api';
	// 前端应用服务
	config.contextPath = '/yyh-app';
	// 静态资源
	config.static = {
		// 7 天
		cacheTime: 7 * 24 * 60 * 60 * 1000,
	};

	// cookie安全字符串
	config.keys = `${app.name}_12345`;

	// 应用基础配置
	config.app = {
		host: process.env.APP_HOST,
		port: process.env.APP_PORT,
	};

	// 数据库配置
	config.mysql = {
		host: process.env.MYSQL_HOST,
		port: process.env.MYSQL_PORT,
		database: process.env.MYSQL_DATABASE,
		username: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
	};

	// 密钥配置
	try {
		config.jwt = {
			privateKey: fs.readFileSync(
				path.resolve(__dirname, './keys/private.key'),
			),
			publicKey: fs.readFileSync(path.resolve(__dirname, './keys/public.key')),
		};
	} catch (err) {
		console.warn(
			err,
			'Warning: JWT keys not found. Please ensure keys are properly configured.',
		);
		config.jwt = {
			privateKey: '',
			publicKey: '',
		};
	}

	return config;
};
