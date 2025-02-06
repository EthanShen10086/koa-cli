const mysql = require('mysql2');
const path = require('path');
const config = require(path.join(__dirname, '../../config/config.default'));
const connection = mysql.createPool(config.mysql);

connection.getConnection((error, conn) => {
	// TODO:修改返回信息 使用封装好的Logger
	conn.connect((err) => {
		if (err) {
			console.log('连接数据库失败', err);
		} else {
			console.log('连接数据库成功');
		}
	});
});

module.exports = connection.promise();
