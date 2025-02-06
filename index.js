const Koa = require('koa');
const mount = require('koa-mount');
const app = new Koa();
const defaultConfig = require('./config/config.default');
const { bodyParser } = require('@koa/bodyparser');
const Router = require('@koa/router');
const { isApp, spaSupport } = require('./app/middleware/static.middleware');

// 初始化
const staticRouter = new Router();
const apiRouter = require('./app/router/index');
const Logger = require('./app/utils/Logger');

// 静态文件挂载位置
app.use(mount(defaultConfig.contextPath), isApp());
// spa 文件支持
staticRouter.get(`${defaultConfig.contextPath}/(.*)`, spaSupport());
app.use(staticRouter.routes()).use(staticRouter.allowedMethods());

// 动态接口 api支持
app.use(bodyParser());
app.use(apiRouter.routes()).use(apiRouter.allowedMethods());
// 统一的错误拦截器 如果业务当中没有及时抛出异常 在这里做兜底
app.on('error', (err, ctx) => {
	const error = new Error('Internal Server Error');
	Logger.error(err);
	ctx.status = 500;
	ctx.body = error.message;
});
app.listen(defaultConfig.app.port, () => {
	Logger.info(
		`Server is running at Server is running at URL_ADDRESS:${defaultConfig.app.host} ${defaultConfig.app.port}`,
	);
});
