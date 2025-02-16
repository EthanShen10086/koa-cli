const Joi = require('joi');
const JWT = require('jsonwebtoken');
const ErrorCodeMap = require('../common/constant/errorCode');
const ValidateUtils = require('../utils/ValidateUtils');
const { encrypt } = require('../utils/CryptUtils');
const initConfig = require('../../config/config.default');
const defaultConfig = initConfig();
const { PUBLIC_KEY } = defaultConfig.jwt;

// 登录时校验中间件
const verifyLoginParams = async (ctx, next) => {
	const params = ctx.request.body;
	// 校验参数
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

const verifyAuth = async (ctx, next) => {
	const authorization = ctx.request.header.authorization;
	if (!authorization) {
		ctx.status = 401;
		ctx.body = {
			code: ErrorCodeMap.ERROR_AUTH_ERROR[0],
			msg: ErrorCodeMap.ERROR_AUTH_ERROR[1],
			data: {},
		};
		return;
	}
	const token = authorization.replace('Bearer ', '');
	// 校验token
	// 改为Promise方式
	await new Promise((resolve, reject) => {
		JWT.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] }, (err, decoded) => {
			if (err) {
				ctx.status = 401;
				ctx.body = {
					code: ErrorCodeMap.ERROR_AUTH_ERROR[0],
					msg: ErrorCodeMap.ERROR_AUTH_ERROR[1],
					data: {},
				};
				return reject(err);
			}
			ctx.user = decoded;
			resolve();
		});
	});
	// 只有验证成功才执行next()
	await next();
};

const cryptoPassword = async (ctx, next) => {
	const { password } = ctx.request.body;
	// 哈希加盐
	ctx.request.body.password = encrypt(password);
	await next();
};

// 防盗链

module.exports = {
	verifyAuth,
	cryptoPassword,
	verifyLoginParams,
};
