const fs = require('fs');
const Logger = require('../utils/Logger');
const path = require('path');
const Router = require('@koa/router');
const initConfig = require('../../config/config.default');
const ErrorCodeMap = require('../common/constant/errorCode');

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

function loadRouteList(router, routePath, middleware = []) {
	try {
		const routeFileList = getRouterFileList(routePath);

		routeFileList.forEach((file) => {
			// require需顶层引入 除非动态引入文件
			// eslint-disable-next-line global-require
			const route = require(file);
			router.use(...middleware, route.routes(), route.allowedMethods());
		});
		Logger.debug(`Loaded ${routeFileList.length} routes from ${routePath}`);
	} catch (error) {
		Logger.info(`Route loading failed: ${routePath}`);
		Logger.error(error, ErrorCodeMap.ERROR_0x0300);
		throw error; // 向上抛出错误
	}
}

function useRouteList(koaApp) {
	try {
		const defaultConfig = initConfig(koaApp);
		const baseRouter = new Router();
		const routeConfigList = [
			{
				prefix: defaultConfig.app.adminAPI,
				path: path.join(__dirname, '../router/admin'),
				// middleware: [authMiddleware]
			},
			{
				prefix: defaultConfig.app.webAPI,
				path: path.join(__dirname, '../router/web'),
				middleware: [],
			},
			{
				prefix: defaultConfig.app.appAPI,
				path: path.join(__dirname, '../router/app'),
				middleware: [],
			},
			{
				prefix: defaultConfig.app.commonAPI,
				path: path.join(__dirname, '../router/common'),
				middleware: [],
			},
		];

		routeConfigList.forEach(({ prefix, path: routePath, middleware }) => {
			const router = new Router({
				prefix,
			});
			loadRouteList(router, routePath, middleware);
			baseRouter.use(router.routes());
		});

		// koaApp.use(baseRouter.routes()).use(DTOMiddleware)
		koaApp.use(baseRouter.routes()).use(baseRouter.allowedMethods());
	} catch (e) {
		Logger.error(e, ErrorCodeMap.ERROR_0x0300);
	}
}

module.exports = useRouteList;
