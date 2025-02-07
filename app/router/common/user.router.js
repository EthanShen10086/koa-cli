const Router = require('@koa/router');
const userController = require('../../controller/common/user.controller');

// 根据url自动获取model 比如 /v1/user
const userRouter = new Router({
	prefix: '/v1/:resource',
});

userRouter.post('/add', userController.add);
userRouter.get('/list', userController.list);
module.exports = userRouter;
