const { Sequelize } = require('sequelize');
const initConfig = require('../../config/config.default');
const Logger = require('../utils/Logger');
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
		Logger.error('数据库连接失败', err);
	});
module.exports = sequelize;
