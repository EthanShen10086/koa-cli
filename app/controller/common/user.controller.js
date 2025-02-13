const Joi = require('joi');
const ErrorCodeMap = require('../../common/constant/errorCode');
const Service = require('../../service/common/user.service');
const BaseController = require('../base.controller');
const Logger = require('../../utils/Logger');
const { notEmpty, filterSensitiveFields } = require('../../utils');
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
		const schema = Joi.object({
			userName: Joi.string().required().trim().messages({
				'string.empty': '用户名不能为空',
				'any.required': '用户名不能为空',
			}),
			password: Joi.string()
				.required()
				.min(8)
				.max(20)
				.pattern(ValidateUtils.pwdValid)
				.messages({
					'string.min':
						'密码必须包含大小写字母、数字和特殊字符，且长度为8-20位',
					'string.max':
						'密码必须包含大小写字母、数字和特殊字符，且长度为8-20位',
					'string.pattern.base':
						'密码必须包含大小写字母、数字和特殊字符，且长度为8-20位',
				}),
			email: Joi.string()
				.allow('', null)
				.optional()
				.trim()
				.pattern(ValidateUtils.emailValid)
				.messages({
					'string.pattern.base':
						'邮箱格式需由大小写字母（a-z、A-Z）、数字（0-9）、下划线（_）或横线（-）组成,邮箱地址中必须包含一个@符号',
				}),
			gender: Joi.number().valid(0, 1, 2).optional().allow(null),
			birthday: Joi.date().iso().optional().allow(null),
			avatarURL: Joi.string().optional().uri().allow('', null),
		}).options({ allowUnknown: true });

		const { error, value } = schema.validate(params, { abortEarly: false });
		if (error) {
			const errorMessage = error.details[0].message;
			return this.error({
				code: ErrorCodeMap.ERROR_PARAMS_ILLEGAL[0],
				msg: errorMessage,
			});
		}
		// 使用验证后的值
		const { userName, password, ...rest } = value;

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

		// 3. 插入用户
		try {
			const addParams = {
				...rest,
				userName,
				password,
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

		const listSchema = Joi.object({
			pageNo: Joi.number().required().min(1).messages({
				'number.base': '页码必须为数字',
				'number.min': '页码不能小于1',
				'any.required': '页码不能为空',
			}),
			pageSize: Joi.number().required().max(100).messages({
				'number.base': '分页大小必须为数字',
				'number.max': '分页大小不能超过100',
				'any.required': '分页大小不能为空',
			}),
		}).options({ allowUnknown: true });

		// 在 list 方法中使用
		const { error, value } = listSchema.validate(params, { abortEarly: false });
		if (error) {
			const errorMessage = error.details[0].message;
			return this.error({
				code: ErrorCodeMap.ERROR_PARAMS_ILLEGAL[0],
				msg: errorMessage,
			});
		}

		const { pageNo, pageSize, ...otherParams } = value;
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
		const schema = Joi.object({
			userName: Joi.string().required().trim().messages({
				'string.empty': '用户名不能为空',
				'any.required': '用户名不能为空',
			}),
			password: Joi.string()
				.required()
				.min(8)
				.max(20)
				.pattern(ValidateUtils.pwdValid)
				.messages({
					'string.min':
						'密码必须包含大小写字母、数字和特殊字符，且长度为8-20位',
					'string.max':
						'密码必须包含大小写字母、数字和特殊字符，且长度为8-20位',
					'string.pattern.base':
						'密码必须包含大小写字母、数字和特殊字符，且长度为8-20位',
				}),
			email: Joi.string()
				.allow('', null)
				.optional()
				.trim()
				.pattern(ValidateUtils.emailValid)
				.messages({
					'string.pattern.base':
						'邮箱格式需由大小写字母（a-z、A-Z）、数字（0-9）、下划线（_）或横线（-）组成,邮箱地址中必须包含一个@符号',
				}),
			gender: Joi.number().valid(0, 1, 2).optional().allow(null),
			birthday: Joi.date().iso().optional().allow(null),
			avatarURL: Joi.string().optional().uri().allow('', null),
		}).options({ allowUnknown: true });

		const { error, value } = schema.validate(params, { abortEarly: false });
		if (error) {
			const errorMessage = error.details[0].message;
			return this.error({
				code: ErrorCodeMap.ERROR_PARAMS_ILLEGAL[0],
				msg: errorMessage,
			});
		}
		// 使用验证后的值
		const { id, userName, password, ...rest } = value;

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
		const schema = Joi.object({
			id: Joi.string().required().trim().messages({
				'string.empty': 'id不能为空',
				'any.required': 'id不能为空',
			}),
		});

		const { error, value } = schema.validate(query, { abortEarly: false });
		if (error) {
			const errorMessage = error.details[0].message;
			return this.error({
				code: ErrorCodeMap.ERROR_PARAMS_ILLEGAL[0],
				msg: errorMessage,
			});
		}
		// 使用验证后的值
		const { id } = value;
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

		const schema = Joi.object({
			id: Joi.string().required().trim().messages({
				'string.empty': 'id不能为空',
				'any.required': 'id不能为空',
			}),
		});

		const { error } = schema.validate({ id }, { abortEarly: false });
		if (error) {
			const errorMessage = error.details[0].message;
			return this.error({
				code: ErrorCodeMap.ERROR_PARAMS_ILLEGAL[0],
				msg: errorMessage,
			});
		}

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

		const schema = Joi.object({
			idList: Joi.array()
				.items(Joi.string().required())
				.min(1)
				.required()
				.messages({
					'array.base': 'ids参数必须为数组',
					'array.min': '至少需要选择一个删除项',
					'any.required': 'ids不能为空',
				}),
		});

		const { error } = schema.validate({ idList }, { abortEarly: false });
		if (error) {
			const errorMessage = error.details[0].message;
			return this.error({
				code: ErrorCodeMap.ERROR_PARAMS_ILLEGAL[0],
				msg: errorMessage,
			});
		}

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
