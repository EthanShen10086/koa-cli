'use strict';
// const isDEV = process.env.NODE_ENV === 'development';
module.exports = (app) => {
	const config = {};
	// 组件名称
	config.componentID = 'yyh';
	// 后端接口服务
	config.adminService = 'yyh-app/admin/api';
	// 前端应用服务
	config.contextPath = 'yyh-app';
	// cookie安全字符串
	config.keys = `${app.name}_12345`;
};
