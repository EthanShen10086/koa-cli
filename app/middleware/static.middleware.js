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

class StaticMiddleware {
	async isApp(ctx, next) {
		const userAgent = ctx.headers['user-agent'];
		if (/mobile|android| iphone| ipad| app/i.test(userAgent)) {
			return ctx.isStaticBoost
				? koaStatic(appStaticPath, staticOptions)(ctx, next)
				: koaStatic(appStaticPath)(ctx, next);
		} else {
			const url = ctx.url;
			if (url.includes('/admin/')) {
				return ctx.isStaticBoost
					? koaStatic(adminStaticPath, staticOptions)(ctx, next)
					: koaStatic(adminStaticPath)(ctx, next);
			} else {
				return ctx.isStaticBoost
					? koaStatic(webStaticPath, staticOptions)(ctx, next)
					: koaStatic(webStaticPath)(ctx, next);
			}
		}
	}
	async spaSupport(ctx) {
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
			// 这里不是业务逻辑 所以用通用的错误处理去承接
			return ctx.app.emit('error', err, ctx);
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
	}
}

module.exports = new StaticMiddleware();
