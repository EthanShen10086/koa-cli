const Router = require('@koa/router');
const UserController = require('../../controller/common/user.controller');

// 根据url自动获取model 比如 /v1/user
const userRouter = new Router({
	prefix: '/v1/:resource',
});

userRouter.post('/add', async (ctx) => {
	const controller = new UserController(ctx);
	await controller.add();
});
userRouter.post('/list', async (ctx) => {
	const controller = new UserController(ctx);
	await controller.list();
});
module.exports = userRouter;
