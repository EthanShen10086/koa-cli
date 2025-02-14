const Router = require('@koa/router');
const UserController = require('../../controller/common/user.controller');
const { cryptoPassword } = require('../../middleware/auth.middleware');
const {
	verifyId,
	verifyQueryId,
	verifyList,
	verifyPageList,
	verifyUser,
} = require('../../middleware/user.middleware');
// 根据url自动获取model 比如 /v1/user
const userRouter = new Router({
	prefix: '/v1/:resource',
});

userRouter.post('/add', verifyUser, cryptoPassword, async (ctx) => {
	const controller = new UserController(ctx);
	await controller.add();
});
userRouter.post('/list', verifyPageList, async (ctx) => {
	const controller = new UserController(ctx);
	await controller.list();
});
userRouter.get('/findById', verifyQueryId, async (ctx) => {
	const controller = new UserController(ctx);
	await controller.findById();
});
userRouter.post('/update', verifyUser, cryptoPassword, async (ctx) => {
	const controller = new UserController(ctx);
	await controller.update();
});
userRouter.post('/delete', verifyId, async (ctx) => {
	const controller = new UserController(ctx);
	await controller.delete();
});
userRouter.post('/batchDelete', verifyList, async (ctx) => {
	const controller = new UserController(ctx);
	await controller.batchDelete();
});
module.exports = userRouter;
