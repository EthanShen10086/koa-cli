const ErrorCodeMap = require('../../common/constant/errorCode');
const { LogInfo } = require('../../common/constant/logData');
const BusinessError = require('../../common/exception/AppError');
const CommonUtils = require('../../utils/index');
const service = require('../../service/common/user.service');

const BaseController = require('../base.controller');
const Logger = require('../../utils/Logger');
class UserController extends BaseController {
	constructor(ctx) {
		super(ctx);
		this.userService = service;
	}
	async add(ctx) {
		let objectName = [];
		let actionDetail = [];
		const params = ctx.request.body;
		const { username, password } = params;

		// ctx.verifyParams({
		// 	username: { type: 'string', required: true },
		// 	password: { type: 'string', required: true },
		//   })

		// 1. 判断用户名和密码是否为空
		if (!username || !password) {
			const error = new BusinessError(ErrorCodeMap.ERROR_0x0004);
			this.handleError(error);
		}

		// 2. 判断用户名是否已经存在
		const user = await service.getUserByUsername(username);
		if (user) {
			const error = new BusinessError(ErrorCodeMap.ERROR_0x0003);
			this.handleError(error);
		}

		// 3. 插入用户
		try {
			const res = await service.createUser(username, password);
			objectName.push(username);
			actionDetail.push(CommonUtils.dataToString(res));
			this.feedback(res);
		} catch (err) {
			this.handleError(err);
		} finally {
			let log = {
				module: LogInfo.MODULE_USER,
				objectType: LogInfo.OBJECT_USER_ITEM,
				objectName: objectName.join(','),
				action: LogInfo.ACTION_ADD,
				actionDetail: actionDetail.join(','),
			};
			Logger.writeLog(log);
			// 手动释放内存
			log = null;
			objectName = null;
			actionDetail = null;
		}
	}
	async list(ctx) {
		console.log('进来了吗');
		ctx.status = 200;
		ctx.body = '请求成功';
	}
}

module.exports = new UserController();
