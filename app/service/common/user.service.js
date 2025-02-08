const connection = require('../../plugin/db');

const User = require('../../model/user');

const BaseService = require('../base.service');
// service 执行sql语句
class UserService extends BaseService {
	constructor() {
		super(User);
	}
	async add(username, password) {
		const sql = `INSERT INTO user (username, password) VALUES (?, ?)`;
		const res = await connection.execute(sql, [username, password]);
		return res[0];
	}
}
module.exports = new UserService();
