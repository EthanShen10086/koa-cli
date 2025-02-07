const Router = require('@koa/router');
const userController = require('../../controller/common/user.controller');

const userRouter = new Router({
	prefix: '/common/user',
});

userRouter.post('/add', userController.add);
userRouter.get('/list', userController.list);
module.exports = userRouter;
