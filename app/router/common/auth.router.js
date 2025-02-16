const Router = require('@koa/router');
const { verifyLoginParams } = require('../../middleware/auth.middleware');
const AuthController = require('../../controller/common/auth.controller');

const authRouter = new Router({
	prefix: '/v1',
});
authRouter.post('/login', verifyLoginParams, async (ctx) => {
	const controller = new AuthController(ctx);
	await controller.login();
});

module.exports = authRouter;
