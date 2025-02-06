const ErrorCodeMap = require('../../common/constant/errorCode');
const BusinessError = require('../../common/exception/AppError');

const Logger = require('../../utils/Logger');
const CommonUtils = require('../../utils/index');
class BaseController {
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
		let newResult = result;
		const defaultCode = {
			code: '0x0000',
		};
		if (newResult.status === 404 || newResult.code === '404') {
			const { code, msg } = ErrorCodeMap.ERROR_404;
			defaultCode.code = code;
			newResult.code = code;
			defaultCode.type = -1;
			defaultCode.msg = msg;
		}
		if (newResult.status === 403 || newResult.code === '403') {
			this.redirect(newResult);
			return;
		}
		if (CommonUtils.isEmpty(newResult)) {
			this.msg({
				...defaultCode,
				status: result.status,
			});
		} else {
			if (newResult.code === '0') {
				this.success(newResult);
			} else {
				if (CommonUtils.isEmpty(newResult.code)) {
					this.error(result.data);
				} else {
					this.msg(newResult);
				}
			}
		}
	}

	static success(data) {
		this.ctx.body = data;
		this.ctx.status = 200;
	}
	// 失败信息封装
	static fail({ data }) {
		this.ctx.body = {
			type: -1,
			code: data.code,
			data: data.data,
			msg: data.msg,
		};
		this.ctx.status = 500;
	}
	// 失败信息封装
	static error({ type, code, msg, data, serviceErrorCode }) {
		// msg需要传入data值的错误码
		this.ctx.body = {
			type: type || -2,
			code,
			data,
			msg,
			serviceErrorCode,
		};
		this.ctx.status = 500;
	}
	static redirect({
		type = -2,
		code = '403',
		data = {},
		msg = 'session过期',
		serviceErrorCode = '403',
	}) {
		this.ctx.body = {
			type,
			code,
			data,
			msg,
			serviceErrorCode,
		};
		this.ctx.status = 403;
	}

	// 异常处理日志打印及返回结果统一封装,适用于页面级请求
	static handleError(error, ConstError = ErrorCodeMap.ERROR_0x0000) {
		// 抛出错误
		this.ctx.app.emit('error', error, this.ctx);
		this.errorHandle(error, ConstError);
	}
	static errorHandle(error, ConstError) {
		// Logger 错误
		if (error instanceof BusinessError) {
			Logger.error(error);
		} else {
			error.code = ConstError[0];
			if (!error.message) {
				error.message = ConstError[1];
			}
			Logger.error(error);
		}
		// 返回错误
		this.error({ code: `${error.code}`, msg: `${error.message}` });
	}

	// 异常处理日志打印及返回结果统一封装,适用于rest接口
	static throwError(error, ConstError) {
		if (error instanceof BusinessError) {
			throw error;
		} else {
			ConstError[1] = error.message || ConstError[1];
			throw new BusinessError(ConstError);
		}
	}
}

module.exports = BaseController;
