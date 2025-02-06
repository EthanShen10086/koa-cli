const path = require('path');
const fs = require('fs');
const koaStatic = require('koa-static');
const Logger = require('../utils/Logger');
const { LogInfo } = require('../common/constant/logData');
const adminStaticPath = path.join(__dirname, '../../static/admin');
const appStaticPath = path.join(__dirname, '../../static/app');
const webStaticPath = path.join(__dirname, '../../static/web');
const { staticOptions } = require(
	path.join(__dirname, '../../config/config.default'),
);

const isApp = async (ctx, next) => {
	const userAgent = ctx.headers['user-agent'];
	if (/mobile|android| iphone| ipad| app/i.test(userAgent)) {
		return ctx.isStaticBoost
			? koaStatic(appStaticPath, staticOptions)
			: koaStatic(appStaticPath);
	} else {
		const url = ctx.url;
		if (url.includes('/admin/')) {
			return ctx.isStaticBoost
				? koaStatic(adminStaticPath, staticOptions)
				: koaStatic(adminStaticPath);
		} else {
			console.log(koaStatic(webStaticPath), '== 看看是什么');
			await next();
			// 	return ctx.isStaticBoost
			// 		? koaStatic(webStaticPath, staticOptions)
			// 		: koaStatic(webStaticPath);
			// }
		}
	}
};

const spaSupport = async (ctx) => {
	const url = ctx.url;
	let objectName = [];
	const map = {
		'/app/admin/': adminStaticPath,
		'/app/app/': appStaticPath,
		'/app/web/': webStaticPath,
	};
	try {
		for (const key in map) {
			if (url.includes(key)) {
				objectName.push(map[key]);
				const filePath = path.join(map[key], 'index.html');
				if (fs.existsSync(filePath)) {
					ctx.type = 'html';
					ctx.body = fs.createReadStream(filePath);
				}
			}
		}
	} catch (err) {
		this.handleError(err);
	} finally {
		let log = {
			module: LogInfo.MODULE_STATIC,
			objectType: LogInfo.OBJECT_FILE,
			objectName: objectName.join(','),
			action: LogInfo.ACTION_INIT,
			actionDetail: '',
		};
		Logger.writeLog(log);
		// 手动释放内存
		log = null;
		objectName = null;
	}
};

module.exports = {
	isApp,
	spaSupport,
};
