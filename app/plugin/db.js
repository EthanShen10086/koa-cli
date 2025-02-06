const mysql = require('mysql2');
const initConfig = require('../../config/config.default');
const Logger = require('../utils/Logger');
const defaultConfig = initConfig();
const connection = mysql.createPool(defaultConfig.mysql);

connection.getConnection((error, conn) => {
	conn.connect((err) => {
		if (err) {
			Logger.handleError(err);
		} else {
			Logger.info('database connect success');
		}
	});
});

module.exports = connection.promise();
