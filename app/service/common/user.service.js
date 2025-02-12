const connection = require('../../plugin/db');

const User = require('../../model/user');

const BaseService = require('../base.service');
const { BusinessError } = require('../../common/exception/AppError');
const ErrorCodeMap = require('../../common/constant/errorCode');
// service 执行sql语句
class UserService extends BaseService {
	constructor() {
		super(User);
	}
	async add(userName, password) {
		try {
			const sql = `INSERT INTO user (userName, password) VALUES (?, ?)`;
			const res = await connection.execute(sql, [userName, password]);
			// 返回成功信息
			return res[0];
		} catch (e) {
			console.error(e);
			throw new BusinessError(ErrorCodeMap.ERROR_SQL_ERROR);
		}
	}
	async getUserByUsername(userName) {
		try {
			const sql = `
            SELECT 
                BIN_TO_UUID(id) AS id, 
                userName, 
                password, 
                createAt, 
                updateAt, 
                gender, 
                birthday, 
                email, 
                avatarURL 
            FROM user 
            WHERE userName = ?`;
			const res = await connection.execute(sql, [userName]);
			return res[0];
		} catch (e) {
			console.error(e);
			throw new BusinessError(ErrorCodeMap.ERROR_SQL_ERROR);
		}
	}
}
module.exports = UserService;
