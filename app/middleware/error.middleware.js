const { AppError } = require('../common/exception/AppError');
const Logger = require('../utils/Logger');

async function errorHandler(ctx, next) {
	try {
		await next();
	} catch (err) {
		Logger.error('未捕获的错误:', err);

		if (err instanceof AppError) {
			ctx.status = err.status;
			ctx.body = {
				code: err.code,
				message: err.message,
			};
		} else {
			ctx.status = 500;
			ctx.body = {
				code: '500',
				message: '服务器内部错误',
			};
		}

		// 触发应用级错误事件
		ctx.app.emit('error', err, ctx);
	}
}

module.exports = errorHandler;
