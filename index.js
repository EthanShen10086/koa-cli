const Koa = require('koa');
const mount = require('koa-mount');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
// 初始化
const app = new Koa();
const initConfig = require('./config/config.default');
const { bodyParser } = require('@koa/bodyparser');
const { isApp, spaSupport } = require('./app/middleware/static.middleware');
const staticRouter = new Router();
const initApiRouter = require('./app/router/index');
const Logger = require('./app/utils/Logger');
const BaseController = require('./app/controller/base.controller');
const defaultConfig = initConfig(app);

app.use(parameter(app));
app.use(cors());
app.use(
	error({
		format: (err) => {
			return { code: err.status, message: err.message, result: err.stack };
		},
		postFormat: (err, { stack, ...rest }) =>
			process.env.NODE_ENV === 'production' ? rest : { stack, ...rest },
	}),
);
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (error) {
		//此方式可输出状态码。传入error可使错误信息更详细
		// ctx.throw(400, '错误信息')
		ctx.throw(error);
	}
});

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
