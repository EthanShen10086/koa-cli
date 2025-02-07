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
	static formatStack(stack) {
		if (!stack) return '';
		// 格式化错误堆栈的逻辑
		return stack
			.split('\n')
			.map((line) => `    at ${line}`)
			.join('\n');
	}
	static log(level, message, error) {
		if (!this.shouldLog(level)) {
			return;
		}
		const timestamp = new Date().toISOString();
		const stack = error ? `\nStack: ${error.stack}` : '';
		let formattedMessage = `[${timestamp}][${level.toUpperCase()}]${message}${stack}\n`;
		// 格式化错误堆栈
		if (error) {
			formattedMessage += `\n${this.formatStack(error.stack)}\n`;
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
				console.error(formattedMessage);
				break;
			default:
				this.writeLog(formattedMessage);
				console.log(formattedMessage);
		}
	}
	// 开发的时候用
	// 单独抽出来 只做 打印 不写入日志
	static error(message, error) {
		this.log('ERROR', message, error);
	}
	static info(message) {
		this.log('INFO', message);
	}
	// 生产查看日志信息
	static writeLog(formattedMessage) {
		fs.appendFileSync(path.join(this.logDir, 'app.log'), formattedMessage);
	}
}

Logger.initialize();
module.exports = Logger;
