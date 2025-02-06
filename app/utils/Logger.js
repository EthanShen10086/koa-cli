const fs = require('fs');
const path = require('path');

if (process.env.NODE_ENV === 'production') {
	Logger.setLevel('INFO');
}

class Logger {
	constructor(logDir = '../../logs') {
		this.logDir = path.join(__dirname, logDir);
		if (!fs.existsSync(this.logDir)) {
			fs.mkdirSync(this.logDir);
		}
	}
	static level = 'DEBUG';
	static setLevel(newLevel) {
		this.level = newLevel;
	}
	static shouldLog(level) {
		const levelList = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
		return levelList.indexOf(level) >= this.level;
	}
	static log(level, message, error) {
		if (!this.shouldLog(level)) {
			return;
		}
		const timestamp = new Date().toIsoString();
		const stack = error ? error.stack : '';
		let formattedMessage = `[${timestamp}][${level.toUpperCase()}]${message}${stack}`;
		// 格式化错误堆栈
		if (error) {
			formattedMessage += `\n${this.formatStack(error.stack)}`;
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
	static formatStack(stack) {
		if (!stack) return '';
		// 格式化错误堆栈的逻辑
		return stack
			.split('\n')
			.map((line) => `    at ${line}`)
			.join('\n');
	}
	// 以error为例
	static error(message, error) {
		this.log('ERROR', message, error);
	}
	static info(message) {
		this.log('INFO', message);
	}
	static writeLog(formattedMessage) {
		fs.appendFileSync(path.join(this.logDir, 'app.log'), formattedMessage);
	}
}
module.exports = Logger;
