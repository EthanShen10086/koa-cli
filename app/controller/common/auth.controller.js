const BaseController = require('../base.controller');
const ErrorCodeMap = require('../../common/constant/errorCode');
const AuthService = require('../../service/common/auth.service');
const UserService = require('../../service/common/user.service');
const { LogInfo } = require('../../common/constant/logData');
const Logger = require('../../utils/Logger');
const JWT = require('jsonwebtoken');
const { decrypt } = require('../../utils/CryptUtils');
const initConfig = require('../../../config/config.default');
const defaultConfig = initConfig();
const { PRIVATE_KEY, cacheTime } = defaultConfig.jwt;

class AuthController extends BaseController {
	constructor(ctx) {
		super(ctx);
		this.userService = new UserService();
		this.authService = new AuthService();
	}
	async login() {
		let objectName = [];
		let actionDetail = [];
		let loginInfo = {};
		const params = this.ctx.request.body;
		// 校验用户是否存在
		// 校验密码是否错误
		// 生成token 将token传递给前端
		const { userName } = params;
		try {
			const user = await this.userService._findByUsername(userName);

			if (!user) {
				const res = {
					code: ErrorCodeMap.ERROR_OBJECT_NOT_EXIST[0],
					data: {},
					msg: ErrorCodeMap.ERROR_OBJECT_NOT_EXIST[1],
				};
				return this.feedback(res);
			} else {
				if (decrypt(params.password, user.password)) {
					const token = JWT.sign({ id: user.id, userName }, PRIVATE_KEY, {
						expiresIn: cacheTime,
						algorithm: 'RS256',
					});
					loginInfo = {
						id: user.id,
						userName,
						token,
					};
				} else {
					const res = {
						code: ErrorCodeMap.ERROR_PASSWORD_ERROR[0],
						data: {},
						msg: ErrorCodeMap.ERROR_PASSWORD_ERROR[1],
					};
					return this.feedback(res);
				}
			}
		} catch (err) {
			return this.errorHandle(err);
		}

		try {
			const result = {
				code: '0',
				data: {
					...loginInfo,
				},
			};
			objectName.push(userName);
			actionDetail.push('AuthController login');
			this.feedback(result);
		} catch (err) {
			return this.errorHandle(err);
		} finally {
			let log = {
				module: LogInfo.MODULE_AUTH,
				objectType: LogInfo.OBJECT_USER_ITEM,
				objectName: objectName.join(','),
				action: LogInfo.ACTION_LOGIN,
				actionDetail: actionDetail.join(','),
			};
			Logger.writeLog(log);
		}
	}
}
module.exports = AuthController;
