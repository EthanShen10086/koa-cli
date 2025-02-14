const ErrorCodeMap = require('../../common/constant/errorCode');
const Service = require('../../service/common/user.service');
const BaseController = require('../base.controller');
const Logger = require('../../utils/Logger');
const { notEmpty, filterSensitiveFields } = require('../../utils');
const { LogInfo } = require('../../common/constant/logData');

class UserController extends BaseController {
	constructor(ctx) {
		super(ctx);
		this.userService = new Service();
	}
	async add() {
		let objectName = [];
		let actionDetail = [];
		const params = this.ctx.request.body;
		// 使用验证后的值
		const { userName } = params;
		try {
			// 2. 判断用户名是否已经存在
			const user = await this.userService.findByUsername(userName);
			if (notEmpty(user)) {
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
		try {
			const addParams = {
				...params,
			};
			await this.userService.add(addParams);
			const result = {
				code: '0',
				data: {},
			};
			objectName.push(userName);
			actionDetail.push(
				'UserController add' + JSON.stringify(filterSensitiveFields(addParams)),
			);
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
		const { pageNo, pageSize, ...otherParams } = params;
		try {
			const data = await this.userService.list(pageNo, pageSize, otherParams);
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
	async update() {
		let objectName = [];
		let actionDetail = [];
		const params = this.ctx.request.body;
		// 使用验证后的值
		const { id, userName, password, ...rest } = params;
		try {
			const user = await this.userService.findByUsername(userName);
			if (notEmpty(user) && user.id !== id) {
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
		try {
			const updateParams = {
				...rest,
				userName,
				password,
			};
			await this.userService.update(id, updateParams);
			const result = {
				code: '0',
				data: {},
			};
			objectName.push(userName);
			actionDetail.push(
				'UserController update' +
					JSON.stringify(filterSensitiveFields(updateParams)),
			);
			this.feedback(result);
		} catch (err) {
			return this.errorHandle(err);
		} finally {
			let log = {
				module: LogInfo.MODULE_USER,
				objectType: LogInfo.OBJECT_USER_ITEM,
				objectName: objectName.join(','),
				action: LogInfo.ACTION_MOD,
				actionDetail: actionDetail.join(','),
			};
			Logger.writeLog(log);
		}
	}
	async findById() {
		let objectName = [];
		let actionDetail = [];
		const query = this.ctx.request.query;
		const { id } = query;
		try {
			// 查找用户
			const user = await this.userService.findById(id);
			const result = {
				code: '0',
				data: user,
			};
			objectName.push(user);
			actionDetail.push('UserController findById');
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
	async delete() {
		let objectName = [];
		let actionDetail = [];
		const { id } = this.ctx.request.body;

		try {
			const existUser = await this.userService.findById(id);
			if (!existUser) {
				return this.error(ErrorCodeMap.ERROR_OBJECT_NOT_EXIST);
			}

			await this.userService.delete(id);
			const result = {
				code: '0',
				data: {},
			};
			objectName.push(id);
			actionDetail.push(`UserController delete ${id}`);
			this.feedback(result);
		} catch (err) {
			return this.errorHandle(err);
		} finally {
			let log = {
				module: LogInfo.MODULE_USER,
				objectType: LogInfo.OBJECT_USER_ITEM,
				objectName: objectName.join(','),
				action: LogInfo.ACTION_DEL,
				actionDetail: actionDetail.join(','),
			};
			Logger.writeLog(log);
		}
	}
	async batchDelete() {
		let objectName = [];
		let actionDetail = [];
		const { idList } = this.ctx.request.body;

		try {
			// 验证所有ID是否存在
			const existUsers = await this.userService.findByIds(idList);
			if (existUsers.length !== idList.length) {
				return this.error(ErrorCodeMap.ERROR_OBJECT_NOT_EXIST);
			}

			await this.userService.batchDelete(idList);
			const result = {
				code: '0',
				data: {},
			};
			objectName.push(...idList);
			actionDetail.push(`UserController batchDelete ${idList.join(',')}`);
			this.feedback(result);
		} catch (err) {
			return this.errorHandle(err);
		} finally {
			let log = {
				module: LogInfo.MODULE_USER,
				objectType: LogInfo.OBJECT_USER_ITEM,
				objectName: objectName.join(','),
				action: LogInfo.ACTION_BATCH_DEL,
				actionDetail: actionDetail.join(','),
			};
			Logger.writeLog(log);
		}
	}
}

module.exports = UserController;
