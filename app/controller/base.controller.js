const ErrorCodeMap = require('../common/constant/errorCode');
const { BusinessError } = require('../common/exception/AppError');

const Logger = require('../utils/Logger');
const CommonUtils = require('../utils/index');
class BaseController {
	constructor(ctx) {
		this.ctx = ctx; // 显式保存上下文
	}
	// 取登录用户对象
	get user() {
		return this.ctx.session.userInfo;
	}

	get userId() {
		const userinfo = this.ctx.session.userInfo;
		if (userinfo) {
			return userinfo.userIndexCode;
		} else {
			return 'admin';
		}
	}
	// 1. 处理业务错误逻辑 日志打印以及结果统一封装
	//  自定义信息
	msg({ type = 0, code = '0', msg = 'SUCCESS', data = {}, status, ...others }) {
		this.ctx.body = {
			code,
			msg,
			data,
			type,
			...others,
		};
		this.ctx.status = status || 200;
	}
	// 要返回的数据
	feedback(result) {
		const defaultCode = {
			code: '0x0000',
		};
		if (CommonUtils.isEmpty(result)) {
			this.msg({
				...defaultCode,
				type: -1,
			});
		}
		const { code = '0' } = result;
		if (code === '0') {
			this.success(result.data);
		} else {
			this.error(result);
		}
	}

	success(data) {
		this.ctx.body = {
			type: 0,
			code: '0',
			data,
			msg: 'SUCCESS',
		};
		this.ctx.status = 200;
	}
	// 失败信息封装
	fail({ code, data, msg }) {
		this.ctx.body = {
			type: -1,
			code: code,
			data: data,
			msg: msg,
		};
		this.ctx.status = 500;
	}
	// 失败信息封装
	error({ type, code, msg, data = {} }) {
		// 这里的body对应res.data 所以前端用res.data.data
		this.ctx.body = {
			type: type || -2,
			code,
			data,
			msg,
		};
		this.ctx.status = 500;
	}
	redirect({ type = -2, code = '403', data = {}, msg = 'session过期' }) {
		this.ctx.body = {
			type,
			code,
			data,
			msg,
		};
		this.ctx.status = 403;
	}

	// 2. 异常处理日志打印及返回结果统一封装 handleError 和 errorHandle 以及 errorController 共同起作用
	handleError(error) {
		// 抛出错误
		this.ctx.app.emit('error', error, this.ctx);
	}
	errorHandle(error, ConstError = ErrorCodeMap.ERROR_Default_ERROR) {
		// Ensure BusinessError is properly imported
		if (!BusinessError) {
			throw new Error('BusinessError class not properly imported');
		}
		Logger.error(error, ConstError);
		// 业务的error code 返回businessCoode
		// 程序的error code 返回500
		this.error({ code: `${error.status}`, msg: `${ConstError[1]}` });
	}

	// 异常处理日志打印及返回结果统一封装,适用于rest接口
	throwError(error, ConstError) {
		if (error instanceof BusinessError) {
			throw error;
		} else {
			ConstError[1] = error.message || ConstError[1];
			throw new BusinessError(ConstError);
		}
	}
}

module.exports = BaseController;
