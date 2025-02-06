const fs = require('fs');
const Logger = require('../utils/Logger');
const path = require('path');

// 递归获取子文件夹中的 .router.js 文件：
function getRouterFiles(dir, fileList = []) {
	const files = fs.readdirSync(dir);
	files.forEach((file) => {
		const filePath = path.join(dir, file);
		if (fs.statSync(filePath).isDirectory()) {
			getRouterFiles(filePath, fileList);
		} else if (file.endsWith('.router.js')) {
			fileList.push(filePath);
		}
	});
	return fileList;
}

function useRouteList(koaApp) {
	try {
		const routeFilePath = path.join(__dirname, '../router');
		const routeFileList = getRouterFiles(routeFilePath);
		console.log(routeFileList, '== routeFiles');
		routeFileList.forEach((file) => {
			// require需顶层引入 除非动态引入文件
			// eslint-disable-next-line global-require
			const route = require(file);
			koaApp.use(route.routes()).use(route.allowedMethods());
		});
	} catch (e) {
		Logger.error(e);
	}
}

module.exports = useRouteList;
