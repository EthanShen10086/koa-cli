const Router = require('@koa/router');
const { create } = require('../../controller/common/user.controller');

const userRouter = new Router({
	prefix: '/common/user',
});

userRouter.post('/add', create);
