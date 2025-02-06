const connection = require('../../plugin/db');
// service 执行sql语句
class UserService {
	async add(username, password) {
		const sql = `INSERT INTO user (username, password) VALUES (?, ?)`;
		const res = await connection.execute(sql, [username, password]);
		return res[0];
	}
}
module.exports = new UserService();
