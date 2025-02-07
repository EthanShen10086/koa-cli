const Koa = require('koa');
const mount = require('koa-mount');
const Router = require('@koa/router');

// 初始化
const app = new Koa();
const initConfig = require('./config/config.default');
const { bodyParser } = require('@koa/bodyparser');
const { isApp, spaSupport } = require('./app/middleware/static.middleware');
const staticRouter = new Router();
const initApiRouter = require('./app/router/index');
const Logger = require('./app/utils/Logger');
const BaseController = require('./app/controller/base');
const defaultConfig = initConfig(app);
// 静态文件挂载
app.use(mount(defaultConfig.contextPath, isApp));
// spa 文件支持
staticRouter.get(`${defaultConfig.contextPath}/(.*)`, spaSupport);
app.use(staticRouter.routes()).use(staticRouter.allowedMethods());

// 动态接口 api支持
app.use(bodyParser());
initApiRouter(app);
// 统一的错误拦截器 如果业务当中没有及时抛出异常 在这里做兜底
app.on('error', (err) => {
	BaseController.errorHandle(err);
});
app.listen(defaultConfig.app.port, () => {
	Logger.info(
		`Server is running at Server is running at URL_ADDRESS:${defaultConfig.app.host}:${defaultConfig.app.port}`,
	);
});
