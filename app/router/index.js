const fs = require('fs');
const Logger = require('../utils/Logger');
const path = require('path');
const Router = require('@koa/router');
const initConfig = require('../../config/config.default');

const defaultConfig = initConfig();

// 递归获取子文件夹中的 .router.js 文件：
function getRouterFileList(dir, fileList = []) {
	const files = fs.readdirSync(dir);
	files.forEach((file) => {
		const filePath = path.join(dir, file);
		if (fs.statSync(filePath).isDirectory()) {
			getRouterFileList(filePath, fileList);
		} else if (file.endsWith('.router.js')) {
			fileList.push(filePath);
		}
	});
	return fileList;
}

// function loadRouteList(router, routePath, middleware = []) {
// 	try {
// 		const routeFileList = getRouterFileList(routePath)

// 		routeFileList.forEach(
// 			(file) => {
// 				// require需顶层引入 除非动态引入文件
// 				// eslint-disable-next-line global-require
// 				const route = require(file);
// 				router.use(...middleware, route.routes(), route.allowedMethods())
// 			}
// 		)
// 	} catch (error) {
// 		Logger.error(`Route loading failed: ${routePath}`, error);
// 		throw error; // 向上抛出错误
// 	}
// }

function useRouteList(koaApp) {
	try {
		const baseRouter = new Router();
		const adminAPI = new Router({
			prefix: defaultConfig.app.adminAPI,
		});
		const webAPI = new Router({
			prefix: defaultConfig.app.webAPI,
		});
		const appAPI = new Router({
			prefix: defaultConfig.app.appAPI,
		});
		// 各自api的中间件
		// adminAPI.use(authMiddleware)

		const adminRoutePath = path.join(__dirname, '../router/admin');
		const webRoutePath = path.join(__dirname, '../router/web');
		const appRoutePath = path.join(__dirname, '../router/app');

		const adminRouteFileList = getRouterFileList(adminRoutePath);
		const webRouteFileList = getRouterFileList(webRoutePath);
		const appRouteFileList = getRouterFileList(appRoutePath);
		adminRouteFileList.forEach((file) => {
			// require需顶层引入 除非动态引入文件
			// eslint-disable-next-line global-require
			const route = require(file);
			adminRoutePath.use(route.routes()).use(route.allowedMethods());
		});

		webRouteFileList.forEach((file) => {
			// require需顶层引入 除非动态引入文件
			// eslint-disable-next-line global-require
			const route = require(file);
			webRouteFileList.use(route.routes()).use(route.allowedMethods());
		});

		appRouteFileList.forEach((file) => {
			// require需顶层引入 除非动态引入文件
			// eslint-disable-next-line global-require
			const route = require(file);
			appRouteFileList.use(route.routes()).use(route.allowedMethods());
		});

		baseRouter.use(adminAPI.routes()).use(webAPI.routes()).use(appAPI.routes());
		// 三个接口公共的中间用.use挂载
		// koaApp.use(baseRouter.routes()).use(DTOMiddleware)
		koaApp.use(baseRouter.routes());
	} catch (e) {
		Logger.error(e);
	}
}

module.exports = useRouteList;
