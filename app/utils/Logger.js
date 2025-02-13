const fs = require('fs');
const path = require('path');

const log4js = require('log4js');
const log4jsConfig = require('../../log4js.config');

log4js.configure(log4jsConfig);

class Logger {
	static level = 'DEBUG';
	static logDir = path.join(__dirname, '../../logs');
	static initialize(logDir = '../../logs') {
		const logDirectory = path.join(__dirname, logDir);
		if (!fs.existsSync(logDirectory)) {
			fs.mkdirSync(logDirectory);
		}
		if (process.env.NODE_ENV === 'production') {
			Logger.setLevel('INFO');
		}
	}
	static setLevel(newLevel) {
		this.level = newLevel;
	}
	static shouldLog(level) {
		const levelList = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
		return levelList.indexOf(level) >= levelList.indexOf(this.level);
	}
	static log(level, message, businessError) {
		if (!this.shouldLog(level)) {
			return;
		}
		const timestamp = new Date().toISOString();
		let formattedMessage = '';
		if (level !== 'ERROR') {
			formattedMessage = `[${timestamp}][${level.toUpperCase()}]${message}\n`;
		} else {
			const [code, msg] = businessError;
			formattedMessage = `[${timestamp}][${level.toUpperCase()}]${code} ${msg}\n`;
		}
		switch (level) {
			case 'DEBUG':
				this.writeLog(formattedMessage);
				console.debug(formattedMessage);
				break;
			case 'INFO':
				this.writeLog(formattedMessage);
				console.info(formattedMessage);
				break;
			case 'WARN':
				this.writeLog(formattedMessage);
				console.warn(formattedMessage);
				break;
			case 'ERROR':
			case 'FATAL':
				this.writeLog(formattedMessage);
				console.error(formattedMessage, message);
				break;
			default:
				this.writeLog(formattedMessage);
				console.log(formattedMessage);
		}
	}
	// 开发的时候用
	// 单独抽出来 只做 打印 不写入日志
	static error(message, businessError) {
		this.log('ERROR', message, businessError);
	}
	static debug(message) {
		this.log('DEBUG', message);
	}
	static info(message) {
		this.log('INFO', message);
	}
	// 生产查看日志信息
	static writeLog(log) {
		// 处理日志内容
		let logContent;
		if (typeof log === 'string') {
			logContent = log;
		} else {
			// 如果日志是对象，将其转换为 JSON 字符串
			logContent = JSON.stringify(log);
		}
		fs.appendFileSync(path.join(this.logDir, 'app.log'), logContent);
	}
}

Logger.initialize();
module.exports = Logger;
