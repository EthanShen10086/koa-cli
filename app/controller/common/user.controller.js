const ErrorCodeMap = require('../../common/constant/errorCode');
const Service = require('../../service/common/user.service');
const BaseController = require('../base.controller');
const Logger = require('../../utils/Logger');
const { notEmpty } = require('../../utils');
const { LogInfo } = require('../../common/constant/logData');
const ValidateUtils = require('../../utils/ValidateUtils');
class UserController extends BaseController {
	constructor(ctx) {
		super(ctx);
		this.userService = new Service();
	}
	async add() {
		let objectName = [];
		let actionDetail = [];
		const params = this.ctx.request.body;
		const { userName, password } = params;
		// 1. 判断用户名和密码是否为空
		try {
			this.ctx.verifyParams({
				userName: {
					type: 'string',
					required: true,
					trim: true,
					message: '用户名不能为空',
				},
				password: {
					type: 'string',
					required: true,
					min: 8,
					max: 20,
					trim: true,
					format: ValidateUtils.pwdValid,
					message: '密码必须包含大小写字母、数字和特殊字符，且长度为8-20位',
				},
			});
		} catch (error) {
			// 格式化 koa-parameter 的错误信息
			const errorMessage = error.errors
				? error.errors[0].message
				: error.message;
			return this.error({
				code: ErrorCodeMap.ERROR_PARAMS_ILLEGAL[0],
				msg: errorMessage,
			});
		}

		try {
			// 2. 判断用户名是否已经存在
			const userList = await this.userService.getUserByUsername(userName);
			if (notEmpty(userList)) {
				const res = {
					code: ErrorCodeMap.ERROR_OBJECT_EXIST[0],
					data: {},
					msg: ErrorCodeMap.ERROR_OBJECT_EXIST[1],
				};
				return this.feedback(res);
			}
		} catch (err) {
			return this.errorHandle(err);
		}

		// 3. 插入用户
		try {
			await this.userService.add(userName, password);
			const result = {
				code: '0',
				data: {},
			};
			objectName.push(userName);
			actionDetail.push('UserController add');
			this.feedback(result);
		} catch (err) {
			return this.errorHandle(err);
		} finally {
			let log = {
				module: LogInfo.MODULE_USER,
				objectType: LogInfo.OBJECT_USER_ITEM,
				objectName: objectName.join(','),
				action: LogInfo.ACTION_ADD,
				actionDetail: actionDetail.join(','),
			};
			Logger.writeLog(log);
		}
	}
	async list() {
		let objectName = [];
		let actionDetail = [];
		const params = this.ctx.request.body;
		const { pageNo, pageSize, userName, startTime, endTime } = params;
		try {
			this.ctx.verifyParams({
				pageNo: {
					type: 'number',
					required: true,
					min: 1,
					message: 'pageNo不能为空 最小为1',
				},
				pageSize: {
					type: 'number',
					required: true,
					max: 100,
					message: 'pageSize不能为空 最大为100',
				},
			});
		} catch (error) {
			// 格式化 koa-parameter 的错误信息
			const errorMessage = error.errors
				? error.errors[0].message
				: error.message;
			return this.error({
				code: ErrorCodeMap.ERROR_PARAMS_ILLEGAL[0],
				msg: errorMessage,
			});
		}
		try {
			const data = await this.userService.list(pageNo, pageSize, {
				userName,
				startTime,
				endTime,
			});
			const result = {
				code: '0',
				data,
			};
			objectName.push('用户列表');
			actionDetail.push('UserController list');
			this.feedback(result);
		} catch (err) {
			return this.errorHandle(err);
		} finally {
			let log = {
				module: LogInfo.MODULE_USER,
				objectType: LogInfo.OBJECT_USER_ITEM,
				objectName: objectName.join(','),
				action: LogInfo.ACTION_QUERY,
				actionDetail: actionDetail.join(','),
			};
			Logger.writeLog(log);
		}
	}
}

module.exports = UserController;
