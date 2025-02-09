const { Sequelize } = require('sequelize');
const initConfig = require('../../config/config.default');
const Logger = require('../utils/Logger');
const ErrorCodeMap = require('../common/constant/errorCode');
const defaultConfig = initConfig();
const sequelize = new Sequelize(
	defaultConfig.mysql.database,
	defaultConfig.mysql.user,
	defaultConfig.mysql.password,
	{
		host: defaultConfig.mysql.host,
		port: defaultConfig.mysql.port,
		dialect: 'mysql',
	},
);

sequelize
	.authenticate()
	.then(() => {
		Logger.info('数据库连接成功');
	})
	.catch((err) => {
		Logger.error(err, ErrorCodeMap.ERROR_DATABASE_INIT);
	});
module.exports = sequelize;
