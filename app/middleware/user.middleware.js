const Joi = require('joi');
const ValidateUtils = require('../utils/ValidateUtils');
const ErrorCodeMap = require('../common/constant/errorCode');

const verifyUser = async (ctx, next) => {
	const params = ctx.request.body;
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
				'string.min': '密码必须包含大小写字母、数字和特殊字符，且长度为8-20位',
				'string.max': '密码必须包含大小写字母、数字和特殊字符，且长度为8-20位',
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

	const { error } = schema.validate(params, { abortEarly: false });
	if (error) {
		const errorMessage = error.details[0].message;
		ctx.status = 500;
		ctx.body = {
			code: ErrorCodeMap.ERROR_PARAMS_ILLEGAL[0],
			msg: errorMessage,
			data: {},
		};
		return;
	}

	await next();
};

const verifyPageList = async (ctx, next) => {
	const params = ctx.request.body;
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
	const { error } = listSchema.validate(params, { abortEarly: false });
	if (error) {
		const errorMessage = error.details[0].message;
		ctx.status = 500;
		ctx.body = {
			code: ErrorCodeMap.ERROR_PARAMS_ILLEGAL[0],
			msg: errorMessage,
			data: {},
		};
		return;
	}

	await next();
};

const verifyId = async (ctx, next) => {
	const params = ctx.request.body;
	const schema = Joi.object({
		id: Joi.string().required().trim().messages({
			'string.empty': 'id不能为空',
			'any.required': 'id不能为空',
		}),
	});
	const { error } = schema.validate(params, { abortEarly: false });
	if (error) {
		const errorMessage = error.details[0].message;
		ctx.status = 500;
		ctx.body = {
			code: ErrorCodeMap.ERROR_PARAMS_ILLEGAL[0],
			msg: errorMessage,
			data: {},
		};
		return;
	}
	await next();
};
const verifyQueryId = async (ctx, next) => {
	const query = ctx.request.query;
	const schema = Joi.object({
		id: Joi.string().required().trim().messages({
			'string.empty': 'id不能为空',
			'any.required': 'id不能为空',
		}),
	});
	const { error } = schema.validate(query, { abortEarly: false });
	if (error) {
		const errorMessage = error.details[0].message;
		ctx.status = 500;
		ctx.body = {
			code: ErrorCodeMap.ERROR_PARAMS_ILLEGAL[0],
			msg: errorMessage,
			data: {},
		};
		return;
	}
	await next();
};

const verifyList = async (ctx, next) => {
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
		ctx.status = 500;
		ctx.body = {
			code: ErrorCodeMap.ERROR_PARAMS_ILLEGAL[0],
			msg: errorMessage,
			data: {},
		};
		return;
	}

	await next();
};

module.exports = {
	verifyUser,
	verifyPageList,
	verifyId,
	verifyQueryId,
	verifyList,
};
