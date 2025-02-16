const Router = require('@koa/router');
const { imgHandler, imgResize } = require('../../middleware/static.middleware');
const { verifyAuth } = require('../../middleware/auth.middleware');
const UploadController = require('../../controller/common/upload.controller');

const uploadRouter = new Router({
	prefix: '/v1/upload',
});
uploadRouter.post(
	'/image/add',
	verifyAuth,
	imgHandler,
	imgResize,
	async (ctx) => {
		const controller = new UploadController(ctx);
		await controller.batchAdd();
	},
);
// 获取上传的静态文件
// uploadRouter.get('/:id', verifyAuth, async (ctx) => {
uploadRouter.get('/:id', async (ctx) => {
	const controller = new UploadController(ctx);
	await controller.getFileById();
});

module.exports = uploadRouter;
